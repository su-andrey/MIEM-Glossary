package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

// Общая структура хэндлеров в данном файле (схоже с категориями)
// Пробуем подключиться к бд и выполнить запрос, если ошибка - выводим информативное сообщение
// При успешном получении данных пытаемся их обработать, в случае отсутствия ошибок возвращаем их
// Если возвращать нечего (например удаление), выводим сообщение (удалённый объект не возвращаем за ненадобностью)
// GetComments возвращает все комментарии
func GetComments(c fiber.Ctx) error {
	rows, err := database.DB.Query(context.Background(),
		`SELECT id, body, author_id FROM comments`)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка запроса к базе данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(&comment.ID, &comment.Body, &comment.PostID, &comment.AuthorID)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Ошибка обработки данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
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
		`SELECT id, body, author_id FROM comments WHERE id = $1`, id).
		Scan(&comment.ID, &comment.Body, &comment.PostID, &comment.AuthorID)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Комментарий не найден"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(comment)
}

// Создать новый комментарий
func CreateComment(c fiber.Ctx) error {
	// Создаем временную структуру для парсинга входных данных
	var input struct {
		PostID int    `json:"post_id"`
		Body   string `json:"body"`
	}

	// Парсим тело запроса
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	userIDRaw := c.Locals("userID")
	if userIDRaw == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
	}
	userID := userIDRaw.(int)

	// Вставляем комментарий в базу
	var commentID int
	err := database.DB.QueryRow(
		context.Background(),
		`INSERT INTO comments (post_id, body, author_id)
		 VALUES ($1, $2, $3) RETURNING id`,
		input.PostID, input.Body, userID,
	).Scan(&commentID) // Получаем ID созданного комментария

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка добавления комментария: " + err.Error()})
	}

	// Формируем объект Comment с вложенным постом
	comment := models.Comment{
		ID:       commentID,    // ID созданного комментария
		PostID:   input.PostID, // Заполненный объект поста
		AuthorID: userID,       // Объект автора
		Body:     input.Body,
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
		"UPDATE comments SET body = $1 WHERE id = $4",
		comment.Body, id)
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
