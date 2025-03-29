package creators

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateCommentsTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		log.Fatal("Ошибка начала транзакции:", err) // логируем критические ошибки
	}
	defer tx.Rollback(ctx)

	var tableExists bool // Проверяем существование таблицы
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments');").
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы comments:", err) // логируем критические ошибки
	}

	if !tableExists { // Создаём таблицу, если её еще не было. Важны типы данных полей и первичные ключи
		_, err = tx.Exec(ctx, `
			CREATE TABLE comments (
				id SERIAL PRIMARY KEY,
				post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
				author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				body TEXT NOT NULL,
				likes INTEGER DEFAULT 0,
				dislikes INTEGER DEFAULT 0
			);
		`)
		if err != nil {
			log.Fatal("Ошибка создания таблицы comments:", err) // логируем критические ошибки
		}

		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции:", err) // логируем критические ошибки
		}

		log.Println("✅ Таблица comments успешно создана!") // Пишем в лог об успехе
	} else {
		tx.Rollback(ctx)
	}
}
