package seeders

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"golang.org/x/crypto/bcrypt"
)

func SeedUsersTable(db *pgxpool.Pool) {
	cfg := config.LoadConfig()

	users := []struct {
		Name     string
		Password string
		IsAdmin  bool
	}{
		{Name: cfg.AdminName, Password: cfg.AdminPassword, IsAdmin: true},
	}
	ctx := context.Background()

	var userAdded bool

	for _, user := range users {
		var userExists bool

		err := db.QueryRow(ctx,
			"SELECT EXISTS (SELECT 1 FROM users WHERE name = $1);",
			user.Name).Scan(&userExists)

		if err != nil {
			log.Fatal("Ошибка проверки существования пользователя: ", err)
		}

		if !userExists {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
			if err != nil {
				log.Fatal("Ошибка хэширования пароля:", err)
			}

			_, err = db.Exec(ctx,
				"INSERT INTO users (name, password, is_admin) VALUES ($1, $2, $3)",
				user.Name, hashedPassword, user.IsAdmin,
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
