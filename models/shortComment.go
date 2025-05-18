package models

type ShortComment struct {
	ID       int    `json:"id"`
	PostID   int    `json:"post"`      // Объект поста
	AuthorID int    `json:"author_id"` // ID автора (анонимность)
	Body     string `json:"body"`      // Содержание комментария
	Likes    int    `json:"likes"`
	Dislikes int    `json:"dislikes"` // Оценки (положительные и отрицательные)
}
