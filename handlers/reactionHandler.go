package handlers

import (
	"context"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"
	"github.com/su-andrey/kr_aip/database"
)

// SetReaction устанавливает реакцию пользователя на пост
func SetReaction(c fiber.Ctx) error {
	// Получаем ID пользователя из контекста (middleware)
	userID, _ := c.Locals("userID").(int)
	// if !ok {
	// 	return c.Status(401).JSON(fiber.Map{"error": "Необходима авторизация"})
	// }

	//Получаем ID поста из параметров URL
	postIDRaw := c.Params("id")
	if postIDRaw == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Отсутствует ID поста"})
	}

	postID, err := strconv.Atoi(postIDRaw)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Некорректный ID поста"})
	}

	// Парсим тип реакции из тела запроса
	var input struct {
		IsLike bool `json:"reaction"`
	}
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	ctx := context.Background()

	// Проверяем существование поста
	var postExists bool
	err = database.DB.QueryRow(ctx,
		"SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1)", postID).
		Scan(&postExists)
	if err != nil || !postExists {
		return c.Status(404).JSON(fiber.Map{"error": "Пост не найден"})
	}

	// Проверяем текущую реакцию пользователя
	var currentReaction *bool
	err = database.DB.QueryRow(ctx,
		"SELECT reaction FROM reactions WHERE user_id = $1 AND post_id = $2",
		userID, postID).Scan(&currentReaction)

	if err != nil && err != pgx.ErrNoRows {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка проверки реакции: " + err.Error()})
	}

	// Обрабатываем реакцию
	if currentReaction == nil {
		// Новая реакция
		_, err = database.DB.Exec(ctx,
			"INSERT INTO reactions (user_id, post_id, reaction) VALUES ($1, $2, $3)",
			userID, postID, input.IsLike)
	} else if *currentReaction == input.IsLike {
		// Удаляем реакцию (отмена)
		_, err = database.DB.Exec(ctx,
			"DELETE FROM reactions WHERE user_id = $1 AND post_id = $2",
			userID, postID)
	} else {
		// Изменяем реакцию
		_, err = database.DB.Exec(ctx,
			"UPDATE reactions SET reaction = $1 WHERE user_id = $2 AND post_id = $3",
			input.IsLike, userID, postID)
	}

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка сохранения реакции"})
	}

	// Обновляем счетчики в посте
	var updateQuery string
	if err == pgx.ErrNoRows || currentReaction == nil {
		if input.IsLike {
			updateQuery = "UPDATE posts SET likes = likes + 1 WHERE id = $1"
		} else {
			updateQuery = "UPDATE posts SET dislikes = dislikes + 1 WHERE id = $1"
		}
	} else if *currentReaction == input.IsLike {
		if input.IsLike {
			updateQuery = "UPDATE posts SET likes = likes - 1 WHERE id = $1"
		} else {
			updateQuery = "UPDATE posts SET dislikes = dislikes - 1 WHERE id = $1"
		}
	} else {
		if input.IsLike {
			updateQuery = "UPDATE posts SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = $1"
		} else {
			updateQuery = "UPDATE posts SET likes = likes - 1, dislikes = dislikes + 1 WHERE id = $1"
		}
	}

	_, err = database.DB.Exec(ctx, updateQuery, postID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка обновления счетчиков"})
	}

	return c.JSON(fiber.Map{"message": "Реакция сохранена"})
}

// GetReaction возвращает реакцию текущего пользователя на пост
func GetReaction(c fiber.Ctx) error {
	// Получаем ID пользователя из контекста (middleware)
	userID, _ := c.Locals("userID").(int)
	// if !ok {
	// 	return c.Status(401).JSON(fiber.Map{"error": "Необходима авторизация"})
	// }

	// Получаем ID поста из параметров URL
	postIDRaw := c.Params("id")
	if postIDRaw == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Отсутствует ID поста"})
	}

	postID, err := strconv.Atoi(postIDRaw)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Некорректный ID поста"})
	}

	var isLike bool
	err = database.DB.QueryRow(context.Background(),
		"SELECT reaction FROM reactions WHERE user_id = $1 AND post_id = $2",
		userID, postID).Scan(&isLike)

	if err != nil {
		// Если реакции нет - возвращаем null
		return c.JSON(nil)
	}

	return c.JSON(fiber.Map{"reaction": isLike})
}
