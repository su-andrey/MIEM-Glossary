package middleware

import (
	"context"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
	"golang.org/x/crypto/bcrypt"
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

	ctx := context.Background()
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error hashing password: ", err)
		return err
	}

	var user models.User
	err = database.DB.QueryRow(ctx,
		`SELECT id, email, password FROM users WHERE email=$1`, input.Email).
		Scan(&user.ID, &user.Email, &user.Password)

	if err != nil {
		if err.Error() == "no rows in result set" {
			err = database.DB.QueryRow(ctx, `
				INSERT INTO users (email, password)
				VALUES ($1, $2) RETURNING id`, input.Email, hashedPassword).Scan(&user.ID)
			if err != nil {
				log.Println("Error creating new user: ", err)
				return err
			}
			log.Println("User created successfully!")
			return nil
		}
		log.Println("Error checking user: ", err)
		return err
	}

	token, err := GenerateJWT(user.ID, false)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	log.Println("User is already created")
	return c.JSON(fiber.Map{"token": token})
}
