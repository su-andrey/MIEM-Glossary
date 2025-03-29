package creators

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

// Схема миграции: создаётся 4 ключевые таблицы. Подробнее их структура описана в других файлах
func Migrate(db *pgxpool.Pool) {
	CreateUsersTable(db)
	CreateCategoriesTable(db)
	CreatePostsTable(db)
	CreateCommentsTable(db)
}
