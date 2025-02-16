package models

type Post struct {
	ID       int      `json:"id"`
	Category Category `json:"category"`  // Объект категории
	AuthorID int      `json:"author_id"` // ID автора (анонимность)
	Name     string   `json:"name"`
	Body     string   `json:"body"`
	Likes    int      `json:"likes"`
	Dislikes int      `json:"dislikes"`
}
