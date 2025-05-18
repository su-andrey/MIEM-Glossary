package models

type Post struct {
	ID          int            `json:"id"`
	Category    Category       `json:"category"`  // Объект категории
	AuthorID    int            `json:"author_id"` // ID автора (анонимность)
	Name        string         `json:"name"`      // Заголовок/название
	Body        string         `json:"body"`      // Содержание, пока строка, в дальнейшем возможно масштабирование
	Likes       int            `json:"likes"`
	Dislikes    int            `json:"dislikes"`     // Оценки (положительные или отрицательные)
	IsModerated bool           `json:"is_moderated"` // Проверен ли пост модератором перед публикацией
	Comments    []ShortComment `json:"comments"`
}
