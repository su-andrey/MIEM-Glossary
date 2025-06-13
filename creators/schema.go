package creators

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/su-andrey/kr_aip/seeders"
)

// Схема миграции: создается 4 ключевые таблицы. Подробнее их структура описана в других файлах
func Migrate(db *pgxpool.Pool) {
	CreateUsersTable(db)
	CreateCategoriesTable(db)
	CreatePostsTable(db)
	CreatePhotosTable(db)
	CreateCommentsTable(db)
	CreateReactionsTable(db)

	seeders.SeedCategoriesTable(db)
	seeders.SeedUsersTable(db)
}
