package handlers

import (
	"context"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/database"
)

func UploadToCloudinary(file multipart.File, fileHeader *multipart.FileHeader, cfg config.Config) (string, error) {
	cld, _ := cloudinary.NewFromParams(cfg.CloudinaryCloudName, cfg.CloudinaryAPIKey, cfg.CloudinaryAPISecret)
	uploadResult, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{})
	if err != nil {
		return "", err
	}
	return uploadResult.SecureURL, nil
}

func UploadPostPhotos(c fiber.Ctx) error {
	postID := c.Params("id")
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "error parsing form"})
	}
	files := form.File["photos[]"]

	var urls []string
	cfg := config.LoadConfig()

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "error opening fileheader"})
		}
		defer file.Close()

		url, err := UploadToCloudinary(file, fileHeader, cfg)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "error uploading to cloud"})
		}
		urls = append(urls, url)

		_, err = database.DB.Exec(context.Background(), "INSERT INTO photos (post_id, url) VALUES ($1, $2)", postID, url)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "error inserting url to DB"})
		}
	}

	return c.JSON(fiber.Map{"urls": urls})
}
