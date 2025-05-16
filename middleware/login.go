package middleware

import (
	"github.com/gofiber/fiber/v3"
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

	user, err := FindUserByEmail(input.Email)

	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Error findind user by email")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Password doesn't match the hash")
	}

	token, err := GenerateJWT(user.ID, user.IsAdmin)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.JSON(fiber.Map{"token": token})
}
