package middleware

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
)

func GetPostAuthorID(c fiber.Ctx) (int, error) {
	postID := c.Params("id")
	var authorID int
	err := database.DB.QueryRow(context.Background(), "SELECT author_id FROM posts WHERE id=$1", postID).Scan(&authorID)
	return authorID, err
}

func GetCreatingPostID(c fiber.Ctx) (int, error) {
	postID := c.Params("id")

	var postExists bool
	err := database.DB.QueryRow(context.Background(),
		"SELECT EXISTS (SELECT 1 FROM posts WHERE id = $1)",
		postID).Scan(&postExists)

	if err != nil {
		return 0, err
	}

	authorIDRaw := c.Locals("userID")
	if authorIDRaw == nil {
		return 0, fiber.NewError(fiber.StatusBadRequest, "missing user id")
	}

	authorID := authorIDRaw.(int)

	if postExists {
		err = database.DB.QueryRow(context.Background(),
			"SELECT author_id FROM posts WHERE id = $1", postID).Scan(&authorID)
	}

	return authorID, err
}

func GetCommentAuthorID(c fiber.Ctx) (int, error) {
	commentID := c.Params("id")
	var authorID int
	err := database.DB.QueryRow(context.Background(), "SELECT author_id FROM comments WHERE id=$1", commentID).Scan(&authorID)
	return authorID, err
}

func GetPhotoPostAuthorID(c fiber.Ctx) (int, error) {
	photoID := c.Params("id")
	var postID int
	err := database.DB.QueryRow(context.Background(), "SELECT post_id FROM photos WHERE id=$1", photoID).Scan(&postID)
	if err != nil {
		return 0, err
	}

	var authorID int
	err = database.DB.QueryRow(context.Background(), "SELECT author_id FROM posts WHERE id=$1", postID).Scan(&authorID)

	return authorID, err
}
