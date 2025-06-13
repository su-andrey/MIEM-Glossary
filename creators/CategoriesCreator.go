package creators

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"go.uber.org/zap"
)

func CreateCategoriesTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		config.Logger.Fatal("Ошибка начала транзакции:", zap.Error(err)) // логируем критические ошибки
	}
	defer tx.Rollback(ctx)

	var tableExists bool // проверяем существование таблицы
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories');").
		Scan(&tableExists)
	if err != nil {
		config.Logger.Fatal("Ошибка проверки таблицы categories:", zap.Error(err)) // логируем критические ошибки
	}

	if !tableExists { // Если таблицы еще не было - создаем. Важны типы данных и первичный ключ
		_, err = tx.Exec(ctx, `
			CREATE TABLE categories (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL UNIQUE
			);
		`)
		if err != nil {
			config.Logger.Fatal("Ошибка создания таблицы categories:", zap.Error(err)) // логируем критические ошибки
		}

		err = tx.Commit(ctx)
		if err != nil {
			config.Logger.Fatal("Ошибка фиксации транзакции:", zap.Error(err)) // логируем критические ошибки
		}

		config.Logger.Info("✅ Таблица categories успешно создана!") // Пишем в лог об успехе
	} else {
		tx.Rollback(ctx)
	}
}
