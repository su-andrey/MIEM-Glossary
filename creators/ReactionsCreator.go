package creators

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateReactionsTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		log.Fatal("Ошибка начала транзакции:", err)
	}
	defer tx.Rollback(ctx)

	// Проверяем, существует ли таблица
	var tableExists bool
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reactions');").
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы reactions:", err)
	}

	// Если таблицы нет — создаем, важно задание типа данных
	if !tableExists {
		_, err = tx.Exec(ctx, `
			CREATE TABLE reactions (
				id SERIAL PRIMARY KEY,
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
				reaction BOOLEAN NOT NULL,
				UNIQUE(user_id, post_id)  
			); 
		`) // Один пользователь - одна реакция на пост
		if err != nil {
			log.Fatal("Ошибка создания таблицы reactions:", err) // логируем критические ошибки
		}

		// Создаем индекс для ускорения поиска реакций по постам
		_, err = tx.Exec(ctx, `
			CREATE INDEX idx_reactions_post_id ON reactions(post_id);
		`)
		if err != nil {
			log.Fatal("Ошибка создания индекса для reactions:", err) // логируем критические ошибки
		}

		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции:", err) // логируем критические ошибки
		}

		log.Println("✅ Таблица reactions успешно создана!") // Пишем сообщение об успехе
	} else { // Откатываем транзакцию, если таблица уже существует
		tx.Rollback(ctx)
	}
}
