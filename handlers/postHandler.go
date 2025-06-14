package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/services"
)

type postInput struct {
	CategoryID int    `json:"category_id" validate:"required,gt=0"`
	Name       string `json:"name" validate:"required,min=1,max=100"`
	Body       string `json:"body" validate:"required,min=1,max=2000"`
}

type updatePostInput struct {
	Name        string `json:"name" validate:"required,min=1,max=100"`
	Body        string `json:"body" validate:"required,min=1,max=2000"`
	Likes       int    `json:"likes"`
	Dislikes    int    `json:"dislikes"`
	IsModerated bool   `json:"is_moderated"`
}

// Общая структура всех функций в данном хэндлере (схожа с другими)
// Выполняем подключение к БД, выполняем запрос. В случае ошибки сообщаем информативно
// Обрабатываем данные (алгоритмы разные от цели)
// Возвращаем полученный результат или сообщение об ошибки. Если результата не является объектом - выводим сообщение
// GetPosts возвращает все посты
func GetPosts(c fiber.Ctx) error {
	cfg := config.LoadConfig()
	var opts services.Options

	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	if cfg.PaginationEnabled {
		limitStr = c.Query("limit", "20")
		offsetStr = c.Query("offset", "0")
	}

	limit, err1 := strconv.Atoi(limitStr)
	offset, err2 := strconv.Atoi(offsetStr)
	if err1 == nil && limit > 0 {
		opts.Limit = &limit
	}
	if err2 == nil && offset >= 0 {
		opts.Offset = &offset
	}

	posts, err := services.GetPosts(c.Context(), &opts)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Ошибка запроса к БД")
	}

	return c.JSON(posts)
}

// GetPost возвращает один пост по ID
func GetPost(c fiber.Ctx) error {
	id := c.Params("id")

	post, err := services.GetPostByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Ошибка запроса к БД")
	}

	return c.JSON(post)
}

// Создать новый пост
func CreatePost(c fiber.Ctx) error {
	// Создаем временную структуру для парсинга входных данных
	var input postInput

	// Парсим тело запроса
	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	userIDRaw := c.Locals("userID")
	if userIDRaw == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
	}
	userID := userIDRaw.(int)

	category, err := services.GetCategoryByID(c.Context(), strconv.Itoa(input.CategoryID))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "категория не найдена")
	}
	if category.Name == "Отзывы" {
		postID, err := strconv.Atoi(input.Name)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "неверный формат ID поста")
		}
		post, err := services.GetPostByID(c.Context(), strconv.Itoa(postID))
		if err != nil || post.Category.Name == "Отзывы" || post.Category.Name == "Вопросы" {
			return fiber.NewError(fiber.StatusBadRequest, "пост не найден или не является постом, на который можно оставить отзыв")
		}
	}

	post, err := services.CreatePost(c.Context(), input.CategoryID, input.Name, input.Body, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "error creating post")
	}

	return c.JSON(post)
}

// UpdatePost обновляет существующий пост
func UpdatePost(c fiber.Ctx) error {
	id := c.Params("id")
	var input updatePostInput

	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	if err := config.Validator.Struct(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ошибка валидации")
	}

	err := services.UpdatePost(c.Context(), id, input.Name, input.Body, input.Likes, input.Dislikes, input.IsModerated)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка обновления поста")
	}

	post, err := services.GetPostByID(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения поста после обновления")
	}

	return c.JSON(post)
}

// DeletePost удаляет пост
func DeletePost(c fiber.Ctx) error {
	id := c.Params("id")

	err := services.DeletePost(c.Context(), id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка удаления поста")
	}

	return c.JSON(fiber.Map{"message": "Пост удален"})
}
