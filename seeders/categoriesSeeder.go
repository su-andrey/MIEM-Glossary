package seeders

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"go.uber.org/zap"
)

func SeedCategoriesTable(db *pgxpool.Pool) {
	categories := []struct {
		Name string
	}{
		{Name: "Кофе"},
		{Name: "Фастфуд и шаурма"},
		{Name: "Копирки"},
		{Name: "Магазины"},
		{Name: "Преподаватели"},
		{Name: "Вопросы"},
		{Name: "Отзывы"},
	}
	ctx := context.Background()

	var categoryAdded bool

	for _, category := range categories {
		var categoryExists bool

		err := db.QueryRow(ctx,
			"SELECT EXISTS (SELECT 1 FROM categories WHERE name = $1);",
			category.Name).Scan(&categoryExists)

		if err != nil {
			config.Logger.Fatal("Ошибка проверки существования категории: ", zap.Error(err))
		}

		if !categoryExists {

			_, err = db.Exec(ctx,
				"INSERT INTO categories (name) VALUES ($1)",
				category.Name,
			)

			if err != nil {
				config.Logger.Fatal("Error adding standart categories: ", zap.Error(err))
			}
			categoryAdded = true
		}
	}

	if categoryAdded {
		config.Logger.Info("✅ Таблица categories успешно заполнена начальными данными")
	}
}
