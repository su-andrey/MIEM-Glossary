package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/services"
)

type categoryInput struct {
	Name string `json:"name" validate:"required,min=1,max=50"`
}

// Общая структура всех функций в данном хэндлере
// - Запрос к БД, обработка ошибки в случае ее возникновения
// - При корректном получении данных обрабатываем их и возвращаем
// - Если объектов на возврат нет (например удаление), то мы не работаем по логике pop, а выдаем сообщение об успехе
// GetCategories возвращает все категории
func GetCategories(c fiber.Ctx) error {
	categories, err := services.GetCategories(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения категории")
	}

	return c.JSON(categories)
}

// Получить информацию о категории по ID
func GetCategory(c fiber.Ctx) error {
	id := c.Params("id")

	category, err := services.GetCategoryByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения категории")
	}

	return c.JSON(category)
}

// CreateCategory создает новую категорию
func CreateCategory(c fiber.Ctx) error {
	var input categoryInput

	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	category, err := services.CreateCategory(c.Context(), input.Name)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка добавления категории")
	}

	return c.JSON(category)
}

// UpdateCategory обновляет категорию
func UpdateCategory(c fiber.Ctx) error {
	id := c.Params("id")
	var input categoryInput

	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	err := services.UpdateCategory(c.Context(), id, input.Name)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления категории")
	}

	category, err := services.GetCategoryByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения обновленной категории")
	}

	return c.JSON(category)
}

// DeleteCategory удаляет категорию
func DeleteCategory(c fiber.Ctx) error {
	id := c.Params("id")

	err := services.DeleteCategory(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка удаления категории")
	}

	return c.JSON(fiber.Map{"message": "Категория удалена"})
}
