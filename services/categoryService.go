package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/su-andrey/kr_aip/database"
	"github.com/su-andrey/kr_aip/models"
)

func GetCategories(ctx context.Context, optCondition ...Condition) ([]models.Category, error) {
	whereStatement := ""
	args := []any{}
	if len(optCondition) > 0 {
		whereStatement = fmt.Sprintf(" WHERE %s %s $1", optCondition[0].Name, optCondition[0].Operator)
		args = append(args, optCondition[0].Value)
	}

	var categories []models.Category

	rows, err := database.DB.Query(ctx,
		"SELECT id, name FROM categories"+whereStatement, args...)
	if err != nil {
		return categories, errors.New("ошибка запроса к базе данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}
	defer rows.Close()

	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return categories, errors.New("ошибка обработки данных") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
		}
		categories = append(categories, category)
	}

	return categories, nil
}

func GetCategoryByID(ctx context.Context, id string) (models.Category, error) {
	var category models.Category
	err := database.DB.QueryRow(ctx,
		"SELECT id, name FROM categories WHERE id = $1", id).
		Scan(&category.ID, &category.Name)

	if err != nil {
		return category, errors.New("категория не найдена") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return category, nil
}

func CreateCategory(ctx context.Context, name string) (models.Category, error) {
	category := models.Category{
		Name: name,
	}

	err := database.DB.QueryRow(ctx,
		"INSERT INTO categories (name) VALUES ($1) RETURNING id", name).Scan(&category.ID)
	if err != nil {
		return category, errors.New("ошибка добавления категории") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return category, nil
}

func UpdateCategory(ctx context.Context, id string, name string) error {
	var exists bool
	err := database.DB.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return errors.New("ошибка проверки существования категории")
	}
	if !exists {
		return errors.New("категория не найдена")
	}

	_, err = database.DB.Exec(ctx,
		"UPDATE categories SET name = $1 WHERE id = $2", name, id)
	if err != nil {
		return errors.New("ошибка обновления категории") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return nil
}

func DeleteCategory(ctx context.Context, id string) error {
	var exists bool
	err := database.DB.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return errors.New("ошибка проверки существования категории")
	}
	if !exists {
		return errors.New("категория не найдена")
	}

	_, err = database.DB.Exec(ctx, "DELETE FROM categories WHERE id = $1", id)
	if err != nil {
		return errors.New("ошибка удаления категории") // Сообщение об ошибке, чтобы приложение не падало по неясной причине
	}

	return nil
}
