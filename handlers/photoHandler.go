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
		return c.Status(400).JSON(fiber.Map{"error": "error parsing form"})
	}
	files := form.File["photos[]"]
	cfg := config.LoadConfig()

	urls, err := services.UploadPostPhotos(c.Context(), cfg, postID, files)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "error uploading photos"})
	}

	return c.JSON(fiber.Map{"urls": urls})
}

func DeletePhoto(c fiber.Ctx) error {
	photoID := c.Params("id")

	err := services.DeletePhoto(c.Context(), photoID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error deleting photo"})
	}

	return c.JSON(fiber.Map{"message": "photo deleted"})
}
