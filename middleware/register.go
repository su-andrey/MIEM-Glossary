package middleware

import (
	"errors"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"
	"github.com/su-andrey/kr_aip/services"
)

func Register(c fiber.Ctx) error {
	type RegisterInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var input RegisterInput
	if err := c.Bind().Body(&input); err != nil {
		return fiber.ErrBadRequest
	}

	if input.Email == "" || input.Password == "" {
		return fiber.ErrBadRequest
	}

	user, err := services.GetUserByEmail(c.Context(), input.Email)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			_, err = services.CreateUser(c.Context(), input.Email, input.Password, false)
			if err != nil {
				return errors.New("error creating new user")
			}

			token, err := GenerateJWT(user.ID, false)
			if err != nil {
				return fiber.NewError(fiber.StatusInternalServerError, err.Error())
			}

			return c.JSON(fiber.Map{"token": token})
		}
		return errors.New("error checking")
	}

	return fiber.NewError(fiber.StatusConflict, "пользователь с данным email уже создан")
}
