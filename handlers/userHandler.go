package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

// Общая структура всех функций в данном файле (схожа с другими хэндлерами)
// Подключаемся к бд, выполняем запрос. В случае ошибки не продолжаем и не пытаемся снова, выводим сообщение
// При успехе обрабатываем полученные данные, если результат объект - возвращаем его, иначе выводим сообщение. При удалении не возвращаем удаленный объект
// GetUsers возвращает всех пользователей
func GetUsers(c fiber.Ctx) error {
	rows, err := database.DB.Query(context.Background(), "SELECT id, email, password, is_admin FROM users")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка запроса к базе данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Ошибка обработки данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		users = append(users, user)
	}

	return c.JSON(users)
}

// GetUser возвращает одного пользователя по ID
func GetUser(c fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	err := database.DB.QueryRow(context.Background(),
		"SELECT id, email, password, is_admin FROM users WHERE id = $1", id).
		Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Пользователь не найден"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(user)
}

// CreateUser создает нового пользователя
func CreateUser(c fiber.Ctx) error {
	user := new(models.User)
	if err := c.Bind().Body(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	_, err := database.DB.Exec(context.Background(),
		"INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3)",
		user.Email, user.Password, user.IsAdmin)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка добавления пользователя"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(user)
}

// UpdateUser обновляет данные пользователя
func UpdateUser(c fiber.Ctx) error {
	id := c.Params("id")
	user := new(models.User)

	if err := c.Bind().Body(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	_, err := database.DB.Exec(context.Background(),
		"UPDATE users SET email = $1, password = $2, is_admin = $3 WHERE id = $4",
		user.Email, user.Password, user.IsAdmin, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка обновления пользователя"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(fiber.Map{"message": "Пользователь обновлен"})
}

// DeleteUser удаляет пользователя
func DeleteUser(c fiber.Ctx) error {
	id := c.Params("id")

	_, err := database.DB.Exec(context.Background(), "DELETE FROM users WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка удаления пользователя"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(fiber.Map{"message": "Пользователь удален"})
}
