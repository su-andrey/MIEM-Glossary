package middleware

import (
	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/services"
	"golang.org/x/crypto/bcrypt"
)

func Login(c fiber.Ctx) error {
	type LoginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var input LoginInput
	if err := c.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "неверный формат данных")
	}

	user, err := services.GetUserByEmail(c.Context(), input.Email)

	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "ошибка поиска пользователя")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "неверный пароль")
	}

	token, err := GenerateJWT(user.ID, user.IsAdmin)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "ошибка генерации токена")
	}

	return c.JSON(fiber.Map{"token": token})
}
