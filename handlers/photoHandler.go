package handlers

import (
	"context"
	"mime/multipart"
	"path"
	"strings"

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

func DeletePhotoFromClodinary(cfg config.Config, url string) error {
	cld, _ := cloudinary.NewFromParams(cfg.CloudinaryCloudName, cfg.CloudinaryAPIKey, cfg.CloudinaryAPISecret)
	parts := strings.Split(url, "/")
	publicIDWithExt := parts[len(parts)-1]
	publicID := strings.TrimSuffix(publicIDWithExt, path.Ext(publicIDWithExt))

	_, err := cld.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: publicID})
	if err != nil {
		return err
	}

	return nil
}

func DeletePhoto(c fiber.Ctx) error {
	photoID := c.Params("id")

	var url string
	err := database.DB.QueryRow(context.Background(), `
		SELECT url FROM photos WHERE id = $1`, photoID).Scan(&url)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "photo not found"})
	}

	cfg := config.LoadConfig()
	err = DeletePhotoFromClodinary(cfg, url)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "error deleting photo from cloudinary"})
	}

	_, err = database.DB.Exec(context.Background(), "DELETE FROM photos WHERE id = $1", photoID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "error deleting from DB"})
	}

	return c.JSON(fiber.Map{"message": "photo deleted"})
}
