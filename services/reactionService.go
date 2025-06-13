package services

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

func GetReaction(ctx context.Context, userID int, postID int) (*models.Reaction, error) {
	var reaction models.Reaction
	err := database.DB.QueryRow(ctx, "SELECT reaction FROM reactions WHERE user_id = $1 AND post_id = $2", userID, postID).Scan(&reaction.Reaction)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return nil, nil // Нет реакции
		}
		return nil, err // Ошибка запроса
	}
	return &reaction, nil // Возвращаем реакцию
}

func SetReaction(ctx context.Context, userID int, postID int, reaction bool) error {
	var postExists bool
	err := database.DB.QueryRow(ctx,
		"SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1)", postID).
		Scan(&postExists)
	if err != nil || !postExists {
		return fiber.NewError(fiber.StatusNotFound, "пост не найден")
	}

	// Проверяем текущую реакцию пользователя
	var currentReaction *bool
	err = database.DB.QueryRow(ctx,
		"SELECT reaction FROM reactions WHERE user_id = $1 AND post_id = $2",
		userID, postID).Scan(&currentReaction)

	if err != nil && err != pgx.ErrNoRows {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка проверки реакции")
	}

	// Обрабатываем реакцию
	if currentReaction == nil {
		// Новая реакция
		_, err = database.DB.Exec(ctx,
			"INSERT INTO reactions (user_id, post_id, reaction) VALUES ($1, $2, $3)",
			userID, postID, reaction)
	} else if *currentReaction == reaction {
		// Удаляем реакцию (отмена)
		_, err = database.DB.Exec(ctx,
			"DELETE FROM reactions WHERE user_id = $1 AND post_id = $2",
			userID, postID)
	} else {
		// Изменяем реакцию
		_, err = database.DB.Exec(ctx,
			"UPDATE reactions SET reaction = $1 WHERE user_id = $2 AND post_id = $3",
			reaction, userID, postID)
	}

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка сохранения реакции")
	}

	// Обновляем счетчики в посте
	var updateQuery string
	// Определяем действие на основе ИСХОДНОГО состояния (currentReaction) и нового (input.IsLike)
	if currentReaction == nil {
		// Новая реакция
		if reaction {
			updateQuery = "UPDATE posts SET likes = likes + 1 WHERE id = $1"
		} else {
			updateQuery = "UPDATE posts SET dislikes = dislikes + 1 WHERE id = $1"
		}
	} else if *currentReaction == reaction {
		// Удаление реакции
		if reaction {
			updateQuery = "UPDATE posts SET likes = likes - 1 WHERE id = $1"
		} else {
			updateQuery = "UPDATE posts SET dislikes = dislikes - 1 WHERE id = $1"
		}
	} else {
		// Изменение реакции
		if reaction {
			updateQuery = "UPDATE posts SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = $1"
		} else {
			updateQuery = "UPDATE posts SET likes = likes - 1, dislikes = dislikes + 1 WHERE id = $1"
		}
	}

	_, err = database.DB.Exec(ctx, updateQuery, postID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления счетчиков")
	}

	return nil
}
