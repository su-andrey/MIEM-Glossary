package models

type Photo struct {
	ID     int    `json:"id"`
	PostID int    `json:"post_id"`
	Url    string `json:"url"`
}
