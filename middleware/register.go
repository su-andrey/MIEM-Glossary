package middleware

import (
	"errors"
	"log"

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
			return nil
		}
		return errors.New("error checking")
	}

	token, err := GenerateJWT(user.ID, false)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Println("User is already created")
	return c.JSON(fiber.Map{"token": token})
}
