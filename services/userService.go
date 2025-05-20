package services

import (
	"context"
	"errors"

	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(ctx context.Context, optConditions ...EqualCondition) ([]models.User, error) {
	var users []models.User

	rows, err := database.DB.Query(ctx, "SELECT id, email, password, is_admin FROM users")
	if err != nil {
		return users, errors.New("ошибка запроса к базе данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin); err != nil {
			return users, errors.New("ошибка обработки данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		users = append(users, user)
	}

	return users, nil
}

func GetUserByID(ctx context.Context, id int) (models.User, error) {
	var user models.User
	err := database.DB.QueryRow(context.Background(),
		"SELECT id, email, password, is_admin FROM users WHERE id = $1", id).
		Scan(&user.ID, &user.Email, &user.Password, &user.IsAdmin)

	if err != nil {
		return user, errors.New("пользователь не найден") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
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
