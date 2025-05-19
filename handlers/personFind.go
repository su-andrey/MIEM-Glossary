package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

// Краткая документация. Пример вызова. Необязательно заполнять все поля. Главное >2 символов и не нарушать порядок: Ф, И, О
// func main() {
// 	response, err := get_link_by_name("Литвиненко Алексей Миха")
// 	if err != nil {
// 		fmt.Printf("%v\n", err)
// 		return
// 	}
// 	if len(response) < 1 {
// 		fmt.Printf("The teacher doesn't seem to exist")
// 		return
// 	}
// 	fmt.Println(response)
// }

func get_link_by_name(fullname string) (string, error) {
	if len(fullname) < 2 {
		return "", fmt.Errorf("Invalid input data") // меньше 2 символов не ищет сайт ВШЭ
	}
	parts := strings.Fields(fullname)
	url := fmt.Sprintf("https://www.hse.ru/org/persons/?search_person=%s", strings.Join(parts[:min(3, len(parts))], "+")) // базовый url поиска
	// Если введены не все поля, то суммаризируем имеющиеся, ищем по ним
	client := &http.Client{
		Timeout: 10 * time.Second,
	} // настраиваем клиент
	req, err := http.NewRequest("GET", url, nil) // отправляем запрос, получаем ответ
	if err != nil {                              // отрабатываем самые популярные ошибки
		return "", fmt.Errorf("Request creation error: %v", err)
	}

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("Request sending error: %v", err)
	}
	defer resp.Body.Close() // Закрываем тело ответа, отложено

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("Error reading the response: %v", err) // проверка тела ответа
	}

	// Проверяем статус код
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Unexpected status-code: %d", resp.StatusCode)
	}
	defer func() { // аналог трай эксепт (на случай, если преподаватель не найден, отложено перехватываем панику)
		if r := recover(); r != nil {
			fmt.Errorf("The teacher doesn't seem to exist: %v", r)
		}
	}()
	id := strings.Split(strings.Split(string(body), "background-image: url(/org/persons/cimage/")[1], ")")[0]
	prepod_link := fmt.Sprintf("https://www.hse.ru/org/persons/%s", id)
	tex, err := http.NewRequest("GET", prepod_link, nil)
	check, err := client.Do(tex)
	if err != nil {
		print(1)
		return "", fmt.Errorf("Error during control request")
	}
	defer check.Body.Close()
	if check.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Error: bad link. Status: %d ", check.StatusCode)
	}
	return prepod_link, nil
}
