package handlers

import (
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/services"
)

func SearchPosts(c fiber.Ctx) error {
	str := strings.TrimSpace(c.Params("str"))

	opts := &services.Options{
		Condition: &services.Condition{
			Name:     "name",
			Operator: services.OpILike,
			Value:    "%" + str + "%",
		},
		OrderByStrPos: &services.OrderByStrPos{
			Name:  "name",
			Value: str,
		},
	}

	posts, err := services.GetPosts(c.Context(), opts)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения постов")
	}

	return c.JSON(posts)
}
