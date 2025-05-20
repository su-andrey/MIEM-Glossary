package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

func GetComments(ctx context.Context, optCondition ...EqualCondition) ([]models.Comment, error) {
	whereStatement := ""
	args := []any{}
	if len(optCondition) > 0 {
		whereStatement = fmt.Sprintf(" WHERE %s = $1", optCondition[0].Name)
		args = append(args, optCondition[0].Value)
	}

	var comments []models.Comment

	rows, err := database.DB.Query(ctx,
		`SELECT id, body, post_id, author_id FROM comments`+whereStatement, args...)
	if err != nil {
		return comments, errors.New("ошибка запроса к базе данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(&comment.ID, &comment.Body, &comment.PostID, &comment.AuthorID)
		if err != nil {
			return comments, errors.New("ошибка обработки данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

func GetCommentById(ctx context.Context, id string) (models.Comment, error) {
	var comment models.Comment
	err := database.DB.QueryRow(ctx,
		`SELECT id, body, author_id FROM comments WHERE id = $1`, id).
		Scan(&comment.ID, &comment.Body, &comment.PostID, &comment.AuthorID)

	if err != nil {
		return comment, errors.New("комментарий не найден") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return comment, nil
}

func CreateComment(ctx context.Context, userID, postID int, body string) (models.Comment, error) {
	var commentID int

	// Вставляем комментарий в базу
	err := database.DB.QueryRow(ctx,
		`INSERT INTO comments (post_id, body, author_id)
		 VALUES ($1, $2, $3) RETURNING id`,
		postID, body, userID,
	).Scan(&commentID) // Получаем ID созданного комментария

	if err != nil {
		return models.Comment{}, errors.New("ошибка добавления комментария")
	}

	// Формируем объект Comment
	comment := models.Comment{
		ID:       commentID, // ID созданного комментария
		PostID:   postID,    // Заполненный объект поста
		AuthorID: userID,    // Объект автора
		Body:     body,
	}

	return comment, nil
}

func UpdateComment(ctx context.Context, id, body string) error {
	_, err := database.DB.Exec(ctx,
		"UPDATE comments SET body = $1 WHERE id = $2",
		body, id)
	if err != nil {
		return errors.New("ошибка обновления комментария")
	}

	return nil
}

func DeleteComment(ctx context.Context, id string) error {
	_, err := database.DB.Exec(context.Background(),
		"DELETE FROM comments WHERE id = $1", id)
	if err != nil {
		return errors.New("ошибка удаления комментария")
	}

	return nil
}
