package services

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

func GetPosts(ctx context.Context, optCondition ...EqualCondition) ([]models.Post, error) {
	whereStatement := ""
	args := []any{}
	if len(optCondition) > 0 {
		whereStatement = fmt.Sprintf(" WHERE %s = $1", optCondition[0].Name)
		args = append(args, optCondition[0].Value)
	}

	var posts []models.Post

	rows, err := database.DB.Query(ctx,
		`SELECT p.id, p.name, p.body, p.likes, p.dislikes, 
		        c.id, c.name, 
		        p.author_id, p.is_moderated 
		 FROM posts p
		 JOIN categories c ON p.category_id = c.id`+whereStatement, args...)
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

		var comments []models.Comment
		rowsComments, err := database.DB.Query(context.Background(),
			`SELECT id, post_id, author_id, body FROM comments WHERE post_id = $1`, post.ID)
		if err != nil {
			return posts, errors.New("ошибка получения комменатриев") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		defer rows.Close()
		for rowsComments.Next() {
			var comment models.Comment
			err := rowsComments.Scan(
				&comment.ID, &comment.PostID, &comment.AuthorID, &comment.Body,
			)

			if err != nil {
				return posts, errors.New("ошибка обработки комментариев") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
			}
			comments = append(comments, comment)
		}
		post.Comments = comments

		photos, err := GetPhotos(ctx, EqualCondition{Name: "post_id", Value: post.ID})
		if err != nil {
			return posts, errors.New("error geting post photos")
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
	var comments []models.Comment
	rowsComments, err := database.DB.Query(context.Background(),
		`SELECT id, post_id, author_id, body FROM comments WHERE post_id = $1`, id)
	if err != nil {
		return post, errors.New("ошибка получения комменатриев") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rowsComments.Close()
	for rowsComments.Next() {
		var comment models.Comment
		err := rowsComments.Scan(
			&comment.ID, &comment.PostID, &comment.AuthorID, &comment.Body,
		)

		if err != nil {
			return post, errors.New("ошибка обработки комментариев") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		comments = append(comments, comment)
	}
	post.Comments = comments

	photos, err := GetPhotos(ctx, EqualCondition{Name: "post_id", Value: post.ID})
	if err != nil {
		return post, errors.New("error geting post photos")
	}

	post.Photos = photos

	return post, nil
}

func CreatePost(ctx context.Context, categoryID int, name, body string, userID int) (models.Post, error) {
	category, err := GetCategoryByID(ctx, strconv.Itoa(categoryID))
	if err != nil {
		return models.Post{}, errors.New("категория не найдена") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	// Вставляем пост в базу
	var postID int
	err = database.DB.QueryRow(
		ctx,
		`INSERT INTO posts (name, body, category_id, author_id)
		 VALUES ($1, $2, $3, $4) RETURNING id`,
		name, body, categoryID, userID,
	).Scan(&postID) // Получаем ID созданного поста

	if err != nil {
		return models.Post{}, errors.New("ошибка добавления поста") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	// Формируем объект Post с вложенной категорией
	post := models.Post{
		ID:          postID,   // Возвращенный ID поста
		Category:    category, // Заполненный объект категории
		AuthorID:    userID,
		Name:        name,
		Body:        body,
		Likes:       0,
		Dislikes:    0,
		IsModerated: false,
	}

	return post, nil
}

func UpdatePost(ctx context.Context, id, name, body string, likes, dislikes int, isModerated bool) error {
	_, err := database.DB.Exec(ctx,
		"UPDATE posts SET name = $1, body = $2, likes = $3, dislikes = $4, is_moderated = $5 WHERE id = $6",
		name, body, likes, dislikes, isModerated, id)
	if err != nil {
		return errors.New("ошибка обновления поста") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return nil
}

func DeletePost(ctx context.Context, id string) error {
	rows, err := database.DB.Query(ctx,
		"SELECT url FROM photos WHERE post_id = $1", id)
	if err != nil {
		return errors.New("error checking post photos")
	}
	defer rows.Close()

	var urls []string
	for rows.Next() {
		var url string
		if err := rows.Scan(&url); err == nil {
			urls = append(urls, url)
		}
	}

	cfg := config.LoadConfig()
	for _, url := range urls {
		err = DeletePhotoFromClodinary(cfg, url)
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
