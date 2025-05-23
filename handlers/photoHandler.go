package handlers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/services"
)

func UploadPostPhotos(c fiber.Ctx) error {
	postID := c.Params("id")
	form, err := c.MultipartForm()
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
	}
	files := form.File["photos[]"]
	// Проверяем сколько уже фотографий у поста
	post, err := services.GetPostByID(c.Context(), postID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения фотографий поста")
	}

	if len(post.Photos)+len(files) > 10 {
		return fiber.NewError(fiber.StatusBadRequest, "на посте не может быть более 10 фотографий")
	}

	cfg := config.LoadConfig()

	urls, err := services.UploadPostPhotos(c.Context(), cfg, postID, files)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка добавления фотографий")
	}

	return c.JSON(fiber.Map{"urls": urls})
}

func DeletePhoto(c fiber.Ctx) error {
	photoID := c.Params("id")

	err := services.DeletePhoto(c.Context(), photoID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка удаления фотографии")
	}

	return c.JSON(fiber.Map{"message": "Фото удалено"})
}
