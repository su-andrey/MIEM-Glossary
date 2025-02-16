package handlers

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

// GetCategories возвращает все категории
func GetCategories(c fiber.Ctx) error {
	rows, err := database.DB.Query(context.Background(), "SELECT id, name FROM categories")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка запроса к базе данных"})
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Ошибка обработки данных"})
		}
		categories = append(categories, category)
	}

	return c.JSON(categories)
}

// Получить информацию о категории по ID
func GetCategory(c fiber.Ctx) error {
	id := c.Params("id")

	var category models.Category
	err := database.DB.QueryRow(context.Background(),
		"SELECT id, name FROM categories WHERE id = $1", id).
		Scan(&category.ID, &category.Name)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Категория не найдена"})
	}

	return c.JSON(category)
}

// CreateCategory создает новую категорию
func CreateCategory(c fiber.Ctx) error {
	category := new(models.Category)
	if err := c.Bind().Body(category); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	_, err := database.DB.Exec(context.Background(),
		"INSERT INTO categories (name) VALUES ($1)", category.Name)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка добавления категории"})
	}

	return c.JSON(category)
}

// UpdateCategory обновляет категорию
func UpdateCategory(c fiber.Ctx) error {
	id := c.Params("id")
	category := new(models.Category)

	if err := c.Bind().Body(category); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"})
	}

	_, err := database.DB.Exec(context.Background(),
		"UPDATE categories SET name = $1 WHERE id = $2", category.Name, id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка обновления категории"})
	}

	return c.JSON(fiber.Map{"message": "Категория обновлена"})
}

// DeleteCategory удаляет категорию
func DeleteCategory(c fiber.Ctx) error {
	id := c.Params("id")

	_, err := database.DB.Exec(context.Background(), "DELETE FROM categories WHERE id = $1", id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка удаления категории"})
	}

	return c.JSON(fiber.Map{"message": "Категория удалена"})
}
