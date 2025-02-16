package creators

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateCategoriesTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		log.Fatal("Ошибка начала транзакции:", err)
	}
	defer tx.Rollback(ctx)

	var tableExists bool
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories');").
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы categories:", err)
	}

	if !tableExists {
		_, err = tx.Exec(ctx, `
			CREATE TABLE categories (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL UNIQUE
			);
		`)
		if err != nil {
			log.Fatal("Ошибка создания таблицы categories:", err)
		}

		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции:", err)
		}

		log.Println("✅ Таблица categories успешно создана!")
	} else {
		tx.Rollback(ctx)
	}
}
