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
		log.Fatal("Ошибка начала транзакции:", err) // логируем критические ошибки
	}
	defer tx.Rollback(ctx)

	var tableExists bool // проверяем существование таблицы
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories');").
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы categories:", err) // логируем критические ошибки
	}

	if !tableExists { // Если таблицы ещё не было - создаём. Важны типы данных и первичный ключ
		_, err = tx.Exec(ctx, `
			CREATE TABLE categories (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL UNIQUE
			);
		`)
		if err != nil {
			log.Fatal("Ошибка создания таблицы categories:", err) // логируем критические ошибки
		}

		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции:", err) // логируем критические ошибки
		}

		log.Println("✅ Таблица categories успешно создана!") // Пишем в лог об успехе
	} else {
		tx.Rollback(ctx)
	}
}
