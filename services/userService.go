package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
	"golang.org/x/crypto/bcrypt"
)

type userOutput struct {
	ID      int    `json:"id"`
	Email   string `json:"email"`
	IsAdmin bool   `json:"is_admin"`
}

func GetUsers(ctx context.Context, optCondition ...Condition) ([]userOutput, error) {
	whereStatement := ""
	args := []any{}
	if len(optCondition) > 0 {
		whereStatement = fmt.Sprintf(" WHERE %s %s $1", optCondition[0].Name, optCondition[0].Operator)
		args = append(args, optCondition[0].Value)
	}
	var users []userOutput

	rows, err := database.DB.Query(ctx,
		"SELECT id, email, is_admin FROM users"+whereStatement, args...)
	if err != nil {
		return users, errors.New("ошибка запроса к базе данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	for rows.Next() {
		var user userOutput
		if err := rows.Scan(&user.ID, &user.Email, &user.IsAdmin); err != nil {
			return users, errors.New("ошибка обработки данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		users = append(users, user)
	}

	return users, nil
}

func GetUserByID(ctx context.Context, id string) (userOutput, error) {
	var user userOutput
	err := database.DB.QueryRow(ctx,
		"SELECT id, email, is_admin FROM users WHERE id = $1", id).
		Scan(&user.ID, &user.Email, &user.IsAdmin)

	if err != nil {
		return user, errors.New("пользователь не найден") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return user, nil
}

func GetUserByEmail(ctx context.Context, email string) (models.User, error) {
	var user models.User

	err := database.DB.QueryRow(ctx, `
		SELECT id, email, password, is_admin FROM users WHERE email=$1`, email).
		Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return user, err
		}
		return user, errors.New("error checking users password")
	}

	return user, nil
}

func CreateUser(ctx context.Context, email, password string, isAdmin bool) (models.User, error) {
	user := models.User{
		Email:    email,
		Password: password,
		IsAdmin:  isAdmin,
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return user, errors.New("ошибка кодирования пароля")
	}

	err = database.DB.QueryRow(ctx,
		"INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) RETURNING id",
		email, passwordHash, isAdmin).Scan(&user.ID)
	if err != nil {
		return user, errors.New("ошибка добавления пользователя") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return user, nil
}

func UpdateUser(ctx context.Context, id, email, password string, isAdmin bool) error {
	var exists bool
	err := database.DB.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return errors.New("ошибка проверки существования пользователя")
	}
	if !exists {
		return errors.New("пользователь не найден")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("ошибка кодирования пароля")
	}

	_, err = database.DB.Exec(ctx,
		"UPDATE users SET email = $1, password = $2, is_admin = $3 WHERE id = $4",
		email, passwordHash, isAdmin, id)
	if err != nil {
		return errors.New("ошибка обновления пользователя") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return nil
}

func DeleteUser(ctx context.Context, id string) error {
	var exists bool
	err := database.DB.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return errors.New("ошибка проверки существования пользователя")
	}
	if !exists {
		return errors.New("пользователь не найден")
	}

	_, err = database.DB.Exec(ctx, "DELETE FROM users WHERE id = $1", id)
	if err != nil {
		return errors.New("ошибка удаления пользователя")
	}

	return nil
}
