package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

// GetPosts возвращает все посты
func GetPosts(c fiber.Ctx) error {
	rows, err := database.DB.Query(context.Background(),
		`SELECT p.id, p.name, p.body, p.likes, p.dislikes, 
		        c.id, c.name, 
		        p.author_id 
		 FROM posts p
		 JOIN categories c ON p.category_id = c.id`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка запроса к базе данных"})
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		err := rows.Scan(&post.ID, &post.Name, &post.Body, &post.Likes, &post.Dislikes,
			&post.Category.ID, &post.Category.Name, &post.AuthorID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Ошибка обработки данных"})
		}
		posts = append(posts, post)
	}

	return c.JSON(posts)
}

// GetPost возвращает один пост по ID
func GetPost(c fiber.Ctx) error {
	id := c.Params("id")

	var post models.Post
	err := database.DB.QueryRow(context.Background(),
		`SELECT p.id, p.name, p.body, p.likes, p.dislikes, 
		        c.id, c.name, 
		        p.author_id
		 FROM posts p
		 JOIN categories c ON p.category_id = c.id
		 WHERE p.id = $1`, id).
		Scan(&post.ID, &post.Name, &post.Body, &post.Likes, &post.Dislikes,
			&post.Category.ID, &post.Category.Name, &post.AuthorID)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Пост не найден"})
	}

	return c.JSON(post)
}

// Создать новый пост
func CreatePost(c fiber.Ctx) error {
	// Создаем временную структуру для парсинга входных данных
	var input struct {
		CategoryID int    `json:"category_id"`
		AuthorID   int    `json:"author_id"`
		Name       string `json:"name"`
		Body       string `json:"body"`
	}

	// Парсим тело запроса
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	// Проверяем, существует ли категория
	var category models.Category
	err := database.DB.QueryRow(
		context.Background(),
		"SELECT id, name FROM categories WHERE id = $1",
		input.CategoryID,
	).Scan(&category.ID, &category.Name)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Категория не найдена"})
	}

	// Вставляем пост в базу
	err = database.DB.QueryRow(
		context.Background(),
		`INSERT INTO posts (name, body, category_id, author_id, likes, dislikes)
		 VALUES ($1, $2, $3, $4, 0, 0) RETURNING id`,
		input.Name, input.Body, input.CategoryID, input.AuthorID,
	).Scan(&input.CategoryID) // Получаем ID созданного поста

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка добавления поста"})
	}

	// Формируем объект Post с вложенной категорией
	post := models.Post{
		ID:       input.CategoryID, // Возвращенный ID поста
		Category: category,         // Заполненный объект категории
		AuthorID: input.AuthorID,
		Name:     input.Name,
		Body:     input.Body,
		Likes:    0,
		Dislikes: 0,
	}

	return c.JSON(post)
}

// UpdatePost обновляет существующий пост
func UpdatePost(c fiber.Ctx) error {
	id := c.Params("id")
	post := new(models.Post)

	if err := c.Bind().Body(post); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	_, err := database.DB.Exec(context.Background(),
		"UPDATE posts SET name = $1, body = $2, likes = $3, dislikes = $4 WHERE id = $5",
		post.Name, post.Body, post.Likes, post.Dislikes, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка обновления поста"})
	}

	return c.JSON(fiber.Map{"message": "Пост обновлен"})
}

// DeletePost удаляет пост
func DeletePost(c fiber.Ctx) error {
	id := c.Params("id")

	_, err := database.DB.Exec(context.Background(),
		"DELETE FROM posts WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка удаления поста"})
	}

	return c.JSON(fiber.Map{"message": "Пост удален"})
}
