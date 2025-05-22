package creators

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"go.uber.org/zap"
)

func CreatePostsTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		config.Logger.Fatal("Ошибка начала транзакции: ", zap.Error(err))
	}
	defer tx.Rollback(ctx)

	var tableExists bool // Проверяем существование таблицы
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts');").
		Scan(&tableExists)
	if err != nil {
		config.Logger.Fatal("Ошибка проверки таблицы posts: ", zap.Error(err)) // логируем критические ошибки
	}

	if !tableExists { // Создаем таблицу, если её еще нет, важны типы данных
		_, err = tx.Exec(ctx, `
			CREATE TABLE posts (
				id SERIAL PRIMARY KEY,
				category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
				author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				name TEXT NOT NULL,
				body TEXT NOT NULL,
				likes INTEGER DEFAULT 0,
				dislikes INTEGER DEFAULT 0,
				is_moderated BOOL DEFAULT FALSE
			);
		`)
		if err != nil {
			config.Logger.Fatal("Ошибка создания таблицы posts: ", zap.Error(err)) // логируем критические ошибки
		}

		err = tx.Commit(ctx)
		if err != nil {
			config.Logger.Fatal("Ошибка фиксации транзакции: ", zap.Error(err)) // логируем критические ошибки
		}

		config.Logger.Info("✅ Таблица posts успешно создана!") // Записываем сообщение об успехе
	} else {
		tx.Rollback(ctx)
	}
}
