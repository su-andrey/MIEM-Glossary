package creators

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

func Migrate(db *pgxpool.Pool) {
	CreateUsersTable(db)
	CreateCategoriesTable(db)
	CreatePostsTable(db)
	CreateCommentsTable(db)
}
