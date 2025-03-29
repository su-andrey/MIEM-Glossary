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
		log.Fatal("Ошибка начала транзакции:", err) // логируем критические ошибки
	}
	defer tx.Rollback(ctx)

	// Проверяем, существует ли таблица users
	var tableExists bool
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users');").
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы users:", err) // логируем критические ошибки
	}

	// Если таблицы нет — создаем, важно задание типа данных
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
			log.Fatal("Ошибка создания таблицы users:", err) // логируем критические ошибки
		}

		// Фиксируем транзакцию
		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции:", err) // логируем критические ошибки
		}

		log.Println("✅ Таблица users успешно создана!") // Пишем сообщение об успехе
	} else {
		// Откатываем транзакцию, если таблица уже существует
		tx.Rollback(ctx)
	}
}
