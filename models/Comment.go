package models

type Comment struct {
	ID       int    `json:"id"`
	PostID   int    `json:"post_id"`   // Объект поста
	AuthorID int    `json:"author_id"` // ID автора (анонимность)
	Body     string `json:"body"`      // Содержание комментария
}
