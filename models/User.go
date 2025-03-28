package models

type User struct {
	ID       int    `json:"id"`       // ID аккаунта пользователя
	Name     string `json:"name"`     // Имя аккаунта
	Password string `json:"password"` // Пароль, используем строку, что логично, цифр может не хватить
	IsAdmin  bool   `json:"is_admin"` // Определяет уровень доступа
}
