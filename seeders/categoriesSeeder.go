package seeders

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
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
		{Name: "Ответы"},
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
			log.Fatal(err, "Ошибка проверки существования категории")
		}

		if !categoryExists {

			_, err = db.Exec(ctx,
				"INSERT INTO categories (name) VALUES ($1)",
				category.Name,
			)

			if err != nil {
				log.Printf("Error adding standart categories")
			}
			categoryAdded = true
		}
	}

	if categoryAdded {
		log.Println("✅ Таблица categories успешно заполнена начальными данными")
	}
}
