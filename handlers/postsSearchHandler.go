package handlers

import (
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/services"
)

func SearchPosts(c fiber.Ctx) error {
	cfg := config.LoadConfig()
	str := strings.TrimSpace(c.Query("str"))

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

	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	if cfg.ENV == "production" {
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

	posts, err := services.GetPosts(c.Context(), opts)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка получения постов")
	}

	return c.JSON(posts)
}
