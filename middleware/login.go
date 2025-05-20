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
		return fiber.ErrBadRequest
	}

	user, err := services.GetUserByEmail(c.Context(), input.Email)

	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "error findind user by email")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "password doesn't match the hash: "+user.Password+"\n"+input.Password)
	}

	token, err := GenerateJWT(user.ID, user.IsAdmin)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "error generating token")
	}

	return c.JSON(fiber.Map{"token": token})
}
