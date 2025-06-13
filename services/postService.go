package services

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

var cfg = config.LoadConfig()

func GetPosts(ctx context.Context, opts *Options) ([]models.Post, error) {
	whereStatement := ""
	args := []any{}
	if opts != nil && opts.Condition != nil {
		whereStatement = fmt.Sprintf(" WHERE p.%s %s $1", opts.Condition.Name, opts.Condition.Operator)
		args = append(args, opts.Condition.Value)
	}

	orderStatement := ""
	if opts != nil && opts.OrderByStrPos != nil {
		orderStatement = fmt.Sprintf(" ORDER BY STRPOS(p.%s, $%d)", opts.OrderByStrPos.Name, len(args)+1)
		args = append(args, opts.OrderByStrPos.Value)
	}

	limitStatement := ""
	if opts != nil && opts.Limit != nil {
		limitStatement = fmt.Sprintf(" LIMIT $%d", len(args)+1)
		args = append(args, opts.Limit)
	}

	offsetStatement := ""
	if opts != nil && opts.Offset != nil {
		offsetStatement = fmt.Sprintf(" OFFSET $%d", len(args)+1)
		args = append(args, opts.Offset)
	}

	var posts []models.Post

	rows, err := database.DB.Query(ctx,
		`SELECT p.id, p.name, p.body, p.likes, p.dislikes, 
		        c.id, c.name, 
		        p.author_id, p.is_moderated 
		 FROM posts p
		 JOIN categories c ON p.category_id = c.id`+whereStatement+orderStatement+limitStatement+offsetStatement, args...)
	if err != nil {
		return posts, errors.New("ошибка запроса к базе данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	for rows.Next() {
		var post models.Post
		err := rows.Scan(&post.ID, &post.Name, &post.Body, &post.Likes, &post.Dislikes,
			&post.Category.ID, &post.Category.Name, &post.AuthorID, &post.IsModerated)
		if err != nil {
			return posts, errors.New("ошибка обработки данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}

		if !cfg.ModerationEnabled {
			post.IsModerated = true // Если модерация отключена, то все посты считаем прошедшими модерацию
		}

		commentsOpts := &Options{
			Condition: &Condition{
				Name:     "post_id",
				Operator: OpEqual,
				Value:    post.ID,
			},
		}

		comments, err := GetComments(ctx, commentsOpts)
		if err != nil {
			return posts, errors.New("ошибка получения комменатриев") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}

		post.Comments = comments

		photos, err := GetPhotos(ctx, Condition{Name: "post_id", Operator: OpEqual, Value: post.ID})
		if err != nil {
			return posts, errors.New("ошибка получения фотографий поста")
		}

		post.Photos = photos

		posts = append(posts, post)
	}

	return posts, nil
}

func GetPostByID(ctx context.Context, id string) (models.Post, error) {
	var post models.Post

	err := database.DB.QueryRow(context.Background(),
		`SELECT p.id, p.name, p.body, p.likes, p.dislikes, 
		        c.id, c.name, 
		        p.author_id, p.is_moderated
		 FROM posts p
		 JOIN categories c ON p.category_id = c.id
		 WHERE p.id = $1`, id).
		Scan(&post.ID, &post.Name, &post.Body, &post.Likes, &post.Dislikes,
			&post.Category.ID, &post.Category.Name, &post.AuthorID, &post.IsModerated)
	if err != nil {
		return post, errors.New("пост не найден") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	if !cfg.ModerationEnabled {
		post.IsModerated = true // Если модерация отключена, то все посты считаем прошедшими модерацию
	}

	commentsOpts := &Options{
		Condition: &Condition{
			Name:     "post_id",
			Operator: OpEqual,
			Value:    post.ID,
		},
	}

	comments, err := GetComments(ctx, commentsOpts)
	if err != nil {
		return post, errors.New("ошибка получения комменатриев") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	post.Comments = comments

	photos, err := GetPhotos(ctx, Condition{Name: "post_id", Operator: OpEqual, Value: post.ID})
	if err != nil {
		return post, errors.New("ошибка получения фотографий поста")
	}

	post.Photos = photos

	return post, nil
}

func CreatePost(ctx context.Context, categoryID int, name, body string, userID int) (models.Post, error) {
	post := models.Post{
		AuthorID: userID,
		Name:     name,
		Body:     body,
	}

	category, err := GetCategoryByID(ctx, strconv.Itoa(categoryID))
	if err != nil {
		return post, errors.New("категория не найдена") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	post.Category = category
	// Вставляем пост в базу
	err = database.DB.QueryRow(
		ctx,
		`INSERT INTO posts (name, body, category_id, author_id)
		 VALUES ($1, $2, $3, $4) RETURNING id`,
		name, body, categoryID, userID,
	).Scan(&post.ID) // Получаем ID созданного поста

	if err != nil {
		return post, errors.New("ошибка добавления поста") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return post, nil
}

func UpdatePost(ctx context.Context, id, name, body string, likes, dislikes int, isModerated bool) error {
	var exists bool
	err := database.DB.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return errors.New("ошибка проверки существования поста")
	}
	if !exists {
		return errors.New("пост не найден")
	}

	if !cfg.ModerationEnabled {
		err = database.DB.QueryRow(ctx, "SELECT is_moderated FROM posts WHERE id = $1", id).Scan(&isModerated)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения статуса модерации поста")
		}
	}

	_, err = database.DB.Exec(ctx,
		"UPDATE posts SET name = $1, body = $2, likes = $3, dislikes = $4, is_moderated = $5 WHERE id = $6",
		name, body, likes, dislikes, isModerated, id)
	if err != nil {
		return errors.New("ошибка обновления поста") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return nil
}

func DeletePost(ctx context.Context, id string) error {
	var exists bool
	err := database.DB.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return errors.New("ошибка проверки существования поста")
	}
	if !exists {
		return errors.New("пост не найден")
	}

	photos, err := GetPhotos(ctx, Condition{Name: "post_id", Operator: OpEqual, Value: id})
	if err != nil {
		return errors.New("ошибка получения фотографий поста")
	}

	cfg := config.LoadConfig()
	for _, photo := range photos {
		err = DeletePhotoFromClodinary(cfg, photo.Url)
		if err != nil {
			return errors.New("error deleting photo from cloudinary")
		}
	}

	_, err = database.DB.Exec(context.Background(),
		"DELETE FROM posts WHERE id = $1", id)
	if err != nil {
		return errors.New("ошибка удаления из БД") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return nil
}
