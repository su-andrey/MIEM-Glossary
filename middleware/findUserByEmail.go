package middleware

import (
	"context"
	"log"

	"github.com/su-andrey/kr_aip/cerrors"
	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

func FindUserByEmail(email string) (models.User, error) {
	ctx := context.Background()
	var userExists bool

	var existedUser models.User
	err := database.DB.QueryRow(ctx, `
		SELECT EXISTS (SELECT 1 FROM users WHERE email = $1);`,
		email).Scan(&userExists)
	if err != nil {
		log.Println("Error checking users existence: ", err)
		return existedUser, err
	}

	if userExists {
		err = database.DB.QueryRow(ctx, `
			SELECT id, email, password FROM users WHERE email=$1`, email).
			Scan(&existedUser.ID, &existedUser.Email, &existedUser.Password)

		if err != nil {
			log.Println("Error checking users password: ", err)
			return existedUser, err
		}

		return existedUser, nil
	}

	return existedUser, cerrors.ErrUserDoesNotExists
}
