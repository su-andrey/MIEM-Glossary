package creators

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/config"
	"go.uber.org/zap"
)

func CreateUsersTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		config.Logger.Fatal("Ошибка начала транзакции: ", zap.Error(err)) // логируем критические ошибки
	}
	defer tx.Rollback(ctx)

	// Проверяем, существует ли таблица users
	var tableExists bool
	err = tx.QueryRow(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users');").
		Scan(&tableExists)
	if err != nil {
		config.Logger.Fatal("Ошибка проверки таблицы users: ", zap.Error(err)) // логируем критические ошибки
	}

	// Если таблицы нет — создаем, важно задание типа данных
	if !tableExists {
		_, err = tx.Exec(ctx, `
			CREATE TABLE users (
				id SERIAL PRIMARY KEY,
				email TEXT NOT NULL,
				password TEXT NOT NULL,
				is_admin BOOLEAN DEFAULT false
			);
		`)
		if err != nil {
			config.Logger.Fatal("Ошибка создания таблицы users: ", zap.Error(err)) // логируем критические ошибки
		}

		// Фиксируем транзакцию
		err = tx.Commit(ctx)
		if err != nil {
			config.Logger.Fatal("Ошибка фиксации транзакции:", zap.Error(err)) // логируем критические ошибки
		}

		config.Logger.Info("✅ Таблица users успешно создана!") // Пишем сообщение об успехе
	} else {
		// Откатываем транзакцию, если таблица уже существует
		tx.Rollback(ctx)
	}
}
