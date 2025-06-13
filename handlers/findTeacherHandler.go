package handlers

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
)

// Краткая документация. Пример вызова. Необязательно заполнять все поля. Главное >2 символов и не нарушать порядок: Ф, И, О
//
//	func main() {
//		response, err := get_link_by_name("Литвиненко Алексей Миха")
//		if err != nil {
//			fmt.Printf("%v\n", err)
//			return
//		}
//		if len(response) < 1 {
//			fmt.Printf("The teacher doesn't seem to exist")
//			return
//		}
//		fmt.Println(response)
//	}
func extractID(body []byte) (string, error) {
	re := regexp.MustCompile(`background-image: url\(/org/persons/cimage/([^)]+)`)
	matches := re.FindStringSubmatch(string(body)) // пробуем найти совпадение (id), если нет - сообщаем об ошибке
	if len(matches) < 2 {
		return "", errors.New("teacher not found")
	}
	return matches[1], nil
}

func FindTeacher(c fiber.Ctx) error {
	type SearchRequest struct {
		Target string `json:"target"`
	}
	var tmp SearchRequest

	if err := c.Bind().Body(&tmp); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request format") // Сообщаем о неверном формате входных данных
	}
	fullname := strings.TrimSpace(tmp.Target)
	if len(fullname) < 2 {
		return fiber.NewError(fiber.StatusBadRequest, "invalid input data") // меньше 2 символов не ищет сайт ВШЭ
	}
	// Разбиваем ФИО на части
	parts := strings.Fields(fullname)
	url := fmt.Sprintf("https://www.hse.ru/org/persons/?search_person=%s", strings.Join(parts[:min(3, len(parts))], "+")) // базовый url поиска
	// Если введены не все поля, то суммаризируем имеющиеся, ищем по ним
	client := &http.Client{
		Timeout: 10 * time.Second,
	} // настраиваем клиент
	req, err := http.NewRequest("GET", url, nil) // отправляем запрос, получаем ответ
	if err != nil {                              // отрабатываем самые популярные ошибки
		return fiber.NewError(fiber.StatusInternalServerError, "request creation error")
	}

	resp, err := client.Do(req)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "request sending error") // Проверка успешности отправки
	}
	defer resp.Body.Close() // Закрываем тело ответа, отложено

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "error reading the response") // проверка тела ответа
	}

	// Проверяем статус код
	if resp.StatusCode != http.StatusOK {
		return fiber.NewError(fiber.StatusInternalServerError, "unexpected status-code") // Проверка кода ответа
	}
	id, err := extractID(body) // необходимо для обработки несуществующих преподавателей
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "the teacher doesn't seem to exist") // Обрабатываем ошибку
	}
	prepod_link := fmt.Sprintf("https://www.hse.ru/org/persons/%s", id)
	tex, err := http.NewRequest("GET", prepod_link, nil)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "error checking link")
	}

	check, err := client.Do(tex)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "error during control request") // Проверка доступности страницы
	}
	defer check.Body.Close()
	if check.StatusCode != http.StatusOK {
		return fiber.NewError(fiber.StatusInternalServerError, "bad link") // Проверка корректности отображения страницы
	}
	return c.JSON(fiber.Map{"link": prepod_link})
}
