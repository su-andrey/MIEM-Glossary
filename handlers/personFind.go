package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

// Краткая документация
// Вызов: response, err := sendRequest("Литвиненко", "Алексей", "Михайлович")
// if err != nil {
// 		fmt.Printf("%v\n", err)
// 		return
// 	}
// 	if len(response) < 1 {
// 		fmt.Printf("The teacher doesn't seem to exist")
// 		return
// 	}
//  fmt.Println(response)

func get_link_by_name(surname string, name string, patronic string) (string, error) {
	url := fmt.Sprintf("https://www.hse.ru/org/persons/?search_person=%s+%s+%s", name, surname, patronic) // базовый url поиска
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
	return fmt.Sprintf("https://www.hse.ru/org/persons/%s", id), nil
}
