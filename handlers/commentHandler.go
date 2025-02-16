package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

// GetComments возвращает все комментарии
func GetComments(c fiber.Ctx) error {
	rows, err := database.DB.Query(context.Background(),
		`SELECT cm.id, cm.body, cm.likes, cm.dislikes, 
		        p.id, p.name, p.body, p.likes, p.dislikes, p.author_id, 
		        c.id, c.name,
		        cm.author_id
		 FROM comments cm
		 JOIN posts p ON cm.post_id = p.id
		 JOIN categories c ON p.category_id = c.id`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка запроса к базе данных"})
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(
			&comment.ID, &comment.Body, &comment.Likes, &comment.Dislikes,
			&comment.Post.ID, &comment.Post.Name, &comment.Post.Body, &comment.Post.Likes, &comment.Post.Dislikes, &comment.Post.AuthorID,
			&comment.Post.Category.ID, &comment.Post.Category.Name,
			&comment.AuthorID,
		)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Ошибка обработки данных"})
		}
		comments = append(comments, comment)
	}

	return c.JSON(comments)
}

// GetComment возвращает один комментарий по ID
func GetComment(c fiber.Ctx) error {
	id := c.Params("id")

	var comment models.Comment
	err := database.DB.QueryRow(context.Background(),
		`SELECT cm.id, cm.body, cm.likes, cm.dislikes, 
		        p.id, p.name, p.body, p.likes, p.dislikes, p.author_id, 
		        c.id, c.name,
		        cm.author_id
		 FROM comments cm
		 JOIN posts p ON cm.post_id = p.id
		 JOIN categories c ON p.category_id = c.id
		 WHERE cm.id = $1`, id).
		Scan(
			&comment.ID, &comment.Body, &comment.Likes, &comment.Dislikes,
			&comment.Post.ID, &comment.Post.Name, &comment.Post.Body, &comment.Post.Likes, &comment.Post.Dislikes, &comment.Post.AuthorID,
			&comment.Post.Category.ID, &comment.Post.Category.Name,
			&comment.AuthorID,
		)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Комментарий не найден"})
	}

	return c.JSON(comment)
}

// Создать новый комментарий
func CreateComment(c fiber.Ctx) error {
	// Создаем временную структуру для парсинга входных данных
	var input struct {
		PostID   int    `json:"post_id"`
		AuthorID int    `json:"author_id"`
		Body     string `json:"body"`
	}

	// Парсим тело запроса
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	// Проверяем, существует ли пост
	var post models.Post
	err := database.DB.QueryRow(
		context.Background(),
		"SELECT id, name, body, category_id, author_id, likes, dislikes FROM posts WHERE id = $1",
		input.PostID,
	).Scan(&post.ID, &post.Name, &post.Body, &post.Category.ID, &post.AuthorID, &post.Likes, &post.Dislikes)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Пост не найден"})
	}

	// Подгружаем объект категории
	err = database.DB.QueryRow(
		context.Background(),
		"SELECT id, name FROM categories WHERE id = $1",
		post.Category.ID,
	).Scan(&post.Category.ID, &post.Category.Name)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка загрузки категории поста"})
	}

	// Вставляем комментарий в базу
	var commentID int
	err = database.DB.QueryRow(
		context.Background(),
		`INSERT INTO comments (post_id, body, author_id, likes, dislikes)
		 VALUES ($1, $2, $3, 0, 0) RETURNING id`,
		input.PostID, input.Body, input.AuthorID,
	).Scan(&commentID) // Получаем ID созданного комментария

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка добавления комментария"})
	}

	// Формируем объект Comment с вложенным постом
	comment := models.Comment{
		ID:       commentID, // ID созданного комментария
		Post:     post,      // Заполненный объект поста
		AuthorID: input.AuthorID,
		Body:     input.Body,
		Likes:    0,
		Dislikes: 0,
	}

	return c.JSON(comment)
}

// UpdateComment обновляет существующий комментарий
func UpdateComment(c fiber.Ctx) error {
	id := c.Params("id")
	comment := new(models.Comment)

	if err := c.Bind().Body(comment); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	_, err := database.DB.Exec(context.Background(),
		"UPDATE comments SET body = $1, likes = $2, dislikes = $3 WHERE id = $4",
		comment.Body, comment.Likes, comment.Dislikes, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка обновления комментария"})
	}

	return c.JSON(fiber.Map{"message": "Комментарий обновлен"})
}

// DeleteComment удаляет комментарий
func DeleteComment(c fiber.Ctx) error {
	id := c.Params("id")

	_, err := database.DB.Exec(context.Background(),
		"DELETE FROM comments WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка удаления комментария"})
	}

	return c.JSON(fiber.Map{"message": "Комментарий удален"})
}
