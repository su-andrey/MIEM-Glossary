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

func GetCommentAuthorID(c fiber.Ctx) (int, error) {
	commentID := c.Params("id")
	var authorID int
	err := database.DB.QueryRow(context.Background(), "SELECT author_id FROM comments WHERE id=$1", commentID).Scan(&authorID)
	return authorID, err
}
