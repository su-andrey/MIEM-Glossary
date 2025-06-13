package seeders

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"github.com/su-andrey/kr_aip/models"
	"go.uber.org/zap"
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
			config.Logger.Fatal("Ошибка проверки существования пользователя: ", zap.Error(err))
		}

		if !userExists {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
			if err != nil {
				config.Logger.Fatal("Ошибка хэширования пароля:", zap.Error(err))
			}

			_, err = db.Exec(ctx,
				"INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3)",
				user.Email, hashedPassword, user.IsAdmin,
			)

			if err != nil {
				config.Logger.Fatal("Error adding standart users: ", zap.Error(err))
			}
			userAdded = true
		}
	}

	if userAdded {
		config.Logger.Info("✅ Таблица users успешно заполнена начальными данными")
	}
}
