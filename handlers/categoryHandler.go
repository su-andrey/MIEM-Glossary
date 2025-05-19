package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/services"
)

// Общая структура всех функций в данном хэндлере
// - Запрос к БД, обработка ошибки в случае её возникновения
// - При корректном получении данных обрабатываем их и возвращаем
// - Если объектов на возврат нет (например удаление), то мы не работаем по логике pop, а выдаём сообщение об успехе
// GetCategories возвращает все категории
func GetCategories(c fiber.Ctx) error {
	categories, err := services.GetCategories(c.Context())
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Ошибка получения категорий"})
	}

	return c.JSON(categories)
}

// Получить информацию о категории по ID
func GetCategory(c fiber.Ctx) error {
	id := c.Params("id")

	category, err := services.GetCategoryByID(c.Context(), id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Ошибка получения категории"})
	}

	return c.JSON(category)
}

// CreateCategory создает новую категорию
func CreateCategory(c fiber.Ctx) error {
	var input struct {
		Name string `json:"name"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	category, err := services.CreateCategory(c.Context(), input.Name)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка создания категории"})
	}

	return c.JSON(category)
}

// UpdateCategory обновляет категорию
func UpdateCategory(c fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		Name string `json:"name"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Неверный формат данных"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	err := services.UpdateCategory(c.Context(), id, input.Name)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка обновления категории"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(fiber.Map{"message": "Категория обновлена"})
}

// DeleteCategory удаляет категорию
func DeleteCategory(c fiber.Ctx) error {
	id := c.Params("id")

	err := services.DeleteCategory(c.Context(), id)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Ошибка удаления категории"}) // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return c.JSON(fiber.Map{"message": "Категория удалена"})
}
