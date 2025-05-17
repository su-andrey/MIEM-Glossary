package creators

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreatePhotosTable(DB *pgxpool.Pool) {
	ctx := context.Background()
	tx, err := DB.Begin(ctx)
	if err != nil {
		log.Fatal("Ошибка начала транзакции: ", err)
	}
	defer tx.Rollback(ctx)

	var tableExists bool
	err = tx.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'photos');`).
		Scan(&tableExists)
	if err != nil {
		log.Fatal("Ошибка проверки таблицы photos: ", err)
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
			log.Fatal("Ошибка создания таблицы photos: ", err)
		}

		err = tx.Commit(ctx)
		if err != nil {
			log.Fatal("Ошибка фиксации транзакции: ", err)
		}

		log.Println("✅ Таблица photos успешно создана!")
	} else {
		tx.Rollback(ctx)
	}
}
