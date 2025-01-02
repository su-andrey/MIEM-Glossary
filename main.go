package main

import (
	"fmt"
	"html/template"
	"net/http"
	"net/url"
	"os"
)

var wd, err = os.Getwd()
var tpl = template.Must(template.ParseFiles(wd + "/templates/index.html")) // Необходимо для поиска без абсолютных путей
// Можно докрутить проверку на пустоту, но не критично, и так есть Must
func indexHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil) // подключение шаблона
}
func registrationHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil)                                         // подключение шаблона
	w.Write([]byte("<h1>Registration is unavailable now</h1>")) // заглушка
}
func loginHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil)                                  // подключение шаблона
	w.Write([]byte("<h1>Login is unavailable now</h1>")) // заглушка
}
func searchHandler(w http.ResponseWriter, r *http.Request) {
	u, err := url.Parse(r.URL.String()) // парсим строку
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal server error")) // Отлавливаем ошибку
		return
	}
	params := u.Query()
	searchKey := params.Get("q")
	fmt.Println("Search topic is: ", searchKey) // вывод в консольку. Исключительно технический, для проверки
	tpl.Execute(w, nil)                         // подключение шаблона
	w.Write([]byte("<h1>Вот что удалось найти по запросу:</h1>"))
	w.Write([]byte(searchKey)) // Технический вывод, убедиться что все ок.
}
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("assets"))                // экземпляр файлового сервера
	mux.Handle("/assets/", http.StripPrefix("/assets/", fs)) // Все пути, начинающиеся с assets отправляются к fs
	mux.HandleFunc("/", indexHandler)                        // Задаем каждой страничке обработчик
	mux.HandleFunc("/registration", registrationHandler)
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/search", searchHandler)
	http.ListenAndServe(":"+port, mux)
}
