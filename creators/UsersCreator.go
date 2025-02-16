package creators

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateUsersTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		log.Fatal("Ошибка начала транзакции:", err)
	}
	defer tx.Rollback(ctx)

	// Проверяем, существует ли таблица users
	var tableExists bool
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users');").
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы users:", err)
	}

	// Если таблицы нет — создаем
	if !tableExists {
		_, err = tx.Exec(ctx, `
			CREATE TABLE users (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				password TEXT NOT NULL,
				is_admin BOOLEAN DEFAULT false
			);
		`)
		if err != nil {
			log.Fatal("Ошибка создания таблицы users:", err)
		}

		// Фиксируем транзакцию
		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции:", err)
		}

		log.Println("✅ Таблица users успешно создана!")
	} else {
		// Откатываем транзакцию, если таблица уже существует
		tx.Rollback(ctx)
	}
}
