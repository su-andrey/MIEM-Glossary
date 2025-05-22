package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/su-andrey/kr_aip/config"
)

func JWTMiddlewate() fiber.Handler {
	cfg := config.LoadConfig()

	return func(c fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			return fiber.NewError(fiber.StatusUnauthorized, "ошибка получения токена")
		}

		tokenStr := strings.TrimPrefix(auth, "Bearer ")

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		claims := token.Claims.(jwt.MapClaims)
		userID := int(claims["user_id"].(float64))
		isAdmin := false
		if v, ok := claims["is_admin"].(bool); ok {
			isAdmin = v
		} else if v, ok := claims["is_admin"].(float64); ok {
			isAdmin = v == 1
		}

		c.Locals("userID", userID)
		c.Locals("isAdmin", isAdmin)

		return c.Next()
	}
}
