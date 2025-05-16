package seeders

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/models"
	"golang.org/x/crypto/bcrypt"
)

func SeedUsersTable(db *pgxpool.Pool) {
	cfg := config.LoadConfig()

	users := []models.User{
		{Email: cfg.AdminEmail, Password: cfg.AdminPassword, IsAdmin: true},
	}
	ctx := context.Background()

	var userAdded bool

	for _, user := range users {
		var userExists bool

		err := db.QueryRow(ctx,
			"SELECT EXISTS (SELECT 1 FROM users WHERE email = $1);",
			user.Email).Scan(&userExists)

		if err != nil {
			log.Fatal("Ошибка проверки существования пользователя: ", err)
		}

		if !userExists {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
			if err != nil {
				log.Fatal("Ошибка хэширования пароля:", err)
			}

			_, err = db.Exec(ctx,
				"INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3)",
				user.Email, hashedPassword, user.IsAdmin,
			)

			if err != nil {
				log.Fatal("Error adding standart users: ", err)
			}
			userAdded = true
		}
	}

	if userAdded {
		log.Println("✅ Таблица users успешно заполнена начальными данными")
	}
}
