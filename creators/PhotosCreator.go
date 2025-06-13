package creators

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"go.uber.org/zap"
)

func CreatePhotosTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		config.Logger.Fatal("Ошибка начала транзакции: ", zap.Error(err))
	}
	defer tx.Rollback(ctx)

	var tableExists bool
	err = tx.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'photos');`).
		Scan(&tableExists)
	if err != nil {
		config.Logger.Fatal("Ошибка проверки таблицы photos: ", zap.Error(err))
	}

	if !tableExists {
		_, err = tx.Exec(ctx, `
			CREATE TABLE photos (
				id SERIAL PRIMARY KEY,
				post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
				url TEXT NOT NULL
			);
		`)
		if err != nil {
			config.Logger.Fatal("Ошибка создания таблицы photos: ", zap.Error(err))
		}

		err = tx.Commit(ctx)
		if err != nil {
			config.Logger.Fatal("Ошибка фиксации транзакции: ", zap.Error(err))
		}

		config.Logger.Info("✅ Таблица photos успешно создана!")
	} else {
		tx.Rollback(ctx)
	}
}
