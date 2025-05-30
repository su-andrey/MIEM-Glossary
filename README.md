# Курсовая работа по АИПУ 1 курс

## Документация и иструкция для запуска этого чуда на своих печках

Для начала установим GOLANG на свой ПК глобально по [этой инструкции](https://go.dev/doc/install)
```ВАЖНО иметь версию не старше 1.23```

## Далее нужно завести сервер PostgreSQL

### Запуск на MacOS

[Инструкция для MacOS](https://ploshadka.net/ustanovka-i-podkljuchenie-postgresql-na-mac-os/)  
`Исполнять инструкицю стоит до момента "Как подключиться к PostgreSQL на Mac OS". Остальное нам не интересно.`
```ВАЖНО```
!Запомнить имя пользователя, пароль и название базы данных для доступа на сервер. Они пригодятся нам позже для подключения БД к приложению!  
Далее необходимо выдать права на редактирование таблиц созданному пользователю.  
Заходим от лица суперпользователя: (замените `<SELECTED NAME>` на выбранное для работы имя)  

```bash
GRANT CREATE ON SCHEMA public TO <SELECTED NAME>;
GRANT USAGE ON SCHEMA public TO <SELECTED NAME>;
```

!!ТАКЖЕ НЕ ЗАБЫВАЙТЕ СТАВИТЬ ТОЧКУ С ЗАПЯТОЙ В КОНЦЕ КАЖДОЙ КОМАНДЫ!!
Для работы с БД также понадобится сброс таблиц, команда: (исполняется внутри psql <db_name>)

```bash
DROP TABLE categories, comments, posts, users, photos, reactions;
```

### Запуск на Windows

Алгоритм действий схож с запуском на MacOS. Важным отличием является другой алгоритм скачивания, наиболее простым вариантом является скачивания PGAdmin4 и дальнейшая работа с помощью psql (запуск в bin директории установки Postgres).
Также необходимо установить node.js с [официального сайта](https://nodejs.org/en/download). После установки необходимо перезапустить компьютер. Все остальные пункты инструкции такие же как и работе на Mac/Linux. Важно, что по умолчанию в OS Windows из-за настроек безопасности отключена возможность запуска в оболочке PowerShell, эту настройку требуется изменить (открыть терминал PowerShell от имени администратора, выполнить Set-ExecutionPolicy RemoteSigned, разрешить для всех) Set-ExecutionPolicy RemoteSigned

## Создание .env файлов

Далее необходимо создать в проекте собственный файл .env по образцу .env_example, руководствуясь инструкциями внутри него.  
В .env необходимо сформировать собственную ссылку для доступа к БД и указать локальный порт localhost, на котором будет запущено !!go!! -приложение  
Аналогично нужно поступить и с .env- файлом в дирректории `/client`

## Настройка air

Далее для стабильной работы с проектом на GO без перезапуска сервера при малейшем изменении нужно будет накатить расширение Air, которое будет автоматически обновлять сервер при каждом сохранении документа.  
Кратко:

```bash
curl -sSfL https://raw.githubusercontent.com/air-verse/air/master/install.sh | sh -s
sudo nano ~/.zshrc

Дописать в конец файла:
alias air="~/.air"

Далее:
^X              #CTRL+X на маке
Y
ENTER
```

(Работает на MacOS)  
[Полная инструкция по установке](https://github.com/air-verse/air)  
!!Ставить нужно ГЛОБАЛЬНО при помощи второго пункта (Via install.sh) и назначить alias как во второй строчке краткой инструкции!!  
  
!!alias нужно назначать после каждого перезапуска терминала!!  

## Установка зависимостей React

Далее нужно установить для работы с проектом- Node.JS и NPM (должны ставиться одновременно при установке ноды)  
[Установка Node.JS](https://nodejs.org/en/download)  
После установки нужно зайти в дирректорию ./client и установить необходимые зависимости:

```bash
cd ./client
npm install --legacy-peer-deps
```

## Запуск

Для работы над проектом потребуется открыть 2 терминала:  
В первом из корневой дирректории проекта вызвать (Для запуска localhost для работы с API)  
```air```
Во втором в дирректории, в которой лежит React (\client) (Для запуска localhost для работы с React)  
```npm run dev```
Перемещение по дирректориям:  
```cd <directoryName>``` для входа в дочернюю дирректорию
```cd ../``` для возврата в родительскую дирректорию
```ls -a``` просмотр дочерних дирректории текущей, в том числе скрытых

## Структура продукта

```structure
.
├── README.md                  # Документация по проекту
├── air.toml                   # Конфигурация для Air (live reload для Go)
├── client                     # Клиентская часть (React-приложение)
│   ├── public                 # Публичные файлы (иконки, статические ресурсы)
│   ├── src                    # Исходный код клиентского приложения
│   │   ├── assets             # Медиафайлы и иконки
│   │   ├── components         # React-компоненты
│   │   ├── custom hooks       # Кастомные хуки и вспомогательные функции
│   │   ├── pages              # Компоненты страниц (React Router)
│   │   ├── queries            # Функции запросов к серверу
│   │   ├── store              # Директория для работы с Redux Storage
│   ├── package.json           # Зависимости клиентского приложения
│   ├── vite.config.js         # Конфигурация Vite
├── cerrorrs                   # Кастомные ошибки
├── config                     # Конфигурационные файлы
├── creators                   # Логика создания таблиц в БД
├── database                   # Подключение и управление базой данных
├── handlers                   # Обработчики HTTP-запросов
├── middleware                 # Промежуточные обработчики авторизации и доступа
├── models                     # Определения моделей данных
├── routes                     # Определение маршрутов API
├── seeders                    # Автоматическое заполнение БД начальными значениями
├── go.mod                     # Определение Go-модуля и зависимостей
├── go.sum                     # Контрольные суммы зависимостей
├── main.go                    # Точка входа в серверное приложение
```

## Работа с API

Для работы с API применимы следующие инструкции:

1. Все запросы отправляются через `http://localhost:<PORT>/<SUFFIX>`  

1. Некоторые запросы требуют авторизации пользователя. Вдальнейшием такие запросы будут помечены __звездочкой__ `(*)`. Авторизация представляет собой наличие у запроса хэдера `(header)` авторизации `(Authorization)` следующего вида:

    ```structure
    Beader _ [key] // "_" означает пробел, "[]" не нужны, указывают на индивидуальный параметр
    ```

    Пример:

    ```structure
    Bearer 49a906d0b6e55a4bf195a667ae41c2fba70a6e0126cebe4c0d6e07f3750b657b
    ```

    Также некоторые маршруты требуют того, чтобы пользователь являлся автором записи, такие запросы будут помечены __двумя звездочками__ `(**)`.

    Наконец, некоторые запросы доступны только админам, их, соответственно, обозначим __тремя звездочками__ `(***)`

    Если запрос содержит несколько меток сразу, значит он требует хотя бы одну из инструкций, не важно, какую именно.

1. Методы:  
    🔹 GET – получение всех объектов и одного конкретного:

    ```requests
    📌 /resource – получить все объекты ресурса
    📌 /resource/{id} – получить объект по id
    ```

    🔹 POST – создание нового объекта:

    ```requests
    📌 /resource – создать объект
    ```

    🔹 PUT – обновление существующего объекта:

    ```requests
    📌 /resource/{id} – обновить объект по id
    ```

    🔹 DELETE – удаление объекта:

    ```requests
    📌 /resource/{id} – удалить объект по id
    ```

1. Суффиксы для получения нужных объектов:  
    1. Объекты `SUFFIX: /api`

        🔹 Пользователи:

        ```requests
        GET     /users              получить всех пользователей     (***)
        GET     /users/{id}         получить пользователя по id     (**)(***)
        POST    /users              создать пользователя вручную    (***)
        PUT     /users/{id}         обновить пользователя по id     (**)(***)
        DELETE  /users/{id}         удалить пользователя по id      (**)(***)
        ```

        🔹 Посты:

        ```requests
        GET     /posts                      получить все посты
        GET     /posts?limit=x&offset=y     получить x постов, начиная с y-того (только в продакшне)
        GET     /posts/{id}                 получить пост по id
        GET     /posts/search/{str}         поиск постов по названию 
        POST    /posts                      создать пост                    (*)
        PUT     /posts/{id}                 обновить пост по id             (**)(***)
        DELETE  /posts/{id}                 удалить пост по id              (**)(***)
        POST    /posts/{id}/photos          добавить фото поста             (**)
        ```

        🔹 Фотографии:

        ```requests
        DELETE /photos/{id}         удалить фото по ID              (**)(***)
        ```

        🔹 Комментарии:

        ```requests
        GET     /comments                       получить все комментарии
        GET     /comments?limit=x&offset=y      получить x постов, начиная с y-того (только в продакшне)
        GET     /comments/{id}                  получить комментарий по id
        POST    /comments                       создать комментарий             (*)
        PUT     /comments/{id}                  обновить комментарий по id      (**)(***)
        DELETE  /comments/{id}                  удалить комментарий по id       (**)(***)
        ```

        🔹 Категории:

        ```requests
        GET     /categories         получить все категории          
        GET     /categories/{id}    получить категорию по id
        POST    /categories/        создать категорию               (***)
        PUT     /categories/{id}    обновить категорию по id        (***)
        DELETE  /categories/{id}    удалить категорию по id         (***)
        ```

        🔹 Реакции (лайки и дизлайки):

        ```requests
        GET     /reactions/{id}     реакции залогиненного юзера по id поста (**) (p.s.: владалец реакции, а не поста)
        POST    /reactions/{id}     поставить реакцию на пост id            (*)
        ```

        🔹 Ссылки (на преподавателей):

        ```requests
        POST    /find_teacher/     найти преподавателя по Фамилии Имени и Отчеству          
        ```

    1. Аутентификация `SUFFIX: /auth`

        ```structure
        POST    /register           зарегистрироваться
        POST    /login              войти в аккаунт
        ```

1. Структура тел запросов и ответов (актуально для API)

1️⃣ Пользователи (users)

```json
// Запрос (POST /users, PUT /users/{id})
{
  "email": "string",
  "password": "string",
  "is_admin": true
}
```

2️⃣ Категории (categories)

```json
// Запрос (POST /categories, PUT /categories/{id})
{
  "name": "string"
}
```

3️⃣ Посты (posts)

```json
// Запрос (POST /posts)
{
  "category_id": 1,
  "author_id": 1,
  "name": "string",
  "body": "string"
}
// Запрос (PUT /posts/{id})
{
  "category_id": 1,
  "author_id": 1,
  "name": "string",
  "body": "string",
  "is_moderated": true
}
```

4️⃣ Комментарии (comments)

```json
// Запрос (POST /comments)
{
  "post_id": 1,
  "author_id": 1,
  "body": "string"
}
// Запрос (PUT /comments)
{
  "body": "string"
}
```

5️⃣ Реакции (reactions)

```json
// Запрос (POST /reactions/{id})
{
  "reaction": true // или false
}
```

6️⃣ Регистрация / вход (register / login)

```json
// Запрос (POST /auth/register, POST /auth/login)
{
  "email": "email@mail.com",
  "password": "password123"
}
```

7️⃣ Поиск преподавателя

```json
// Запрос (POST /find_teacher)
{
  "target": "Surname Name Patronymic"
}
```

---

1️⃣ Пользователи (users)

```json
// Ответ (GET /users, GET /users/{id}, POST /users, PUT /users/{id})
{
  "id": 1,
  "email": "string",
  "is_admin": true
}
```

2️⃣ Категории (categories)

```json
// Ответ (GET /categories, GET /categories/{id}, POST /categories, PUT /categories/{id})
{
  "id": 1,
  "name": "string"
}
```

3️⃣ Посты (posts)

```json
// Ответ (GET /posts, GET /posts/{id}, POST /posts, PUT /posts/{id})
{
  "id": 1,
  "isModerated": true,
  "category": {
    "id": 1,
    "name": "string"
  },
  "author_id": 1,
  "name": "string",
  "body": "string",
  "likes": 1,
  "dislikes": 1,
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "body": "string",
      "author_id": 1
    }
  ],
  "photos": [
    {
      "id": 1,
      "post_id": 1,
      "url": "string"
    }
  ]
}
```

4️⃣ Комментарии (comments)

```json
// Ответ (GET /comments, GET /comments/{id}, POST /comments, PUT /comments/{id})
{
  "id": 1,
  "post_id": 1,
  "body": "string",
  "author_id": 1
}
```

5️⃣ Реакции (reactions)

```json
// Ответ (GET /reactions/{id})
{
  "reaction": true // true - лайк, false - дизлайк
}
```

6️⃣ Регистрация / вход (register / login)

```json
// Ответ (POST /auth/register, POST /auth/login)
{
  "token": "string" // JWT-токен
}
```

7️⃣ Поиск преподавателя

```json
// Ответ (POST /find_teacher)
{
  "link": "https://www.hse.ru/org/persons/999999999"
}
```

---

❗ Пример ответа с ошибкой (универсальный формат):

```json
{
  "error": "string",
  "details": "string (опционально)" // в будущем
}
```

## Список используемых библиотек

[Fiber V3](https://docs.gofiber.io/next/)
[GoDotEnv](https://github.com/joho/godotenv)
[PGX Pool]("github.com/jackc/pgx/v5/pgxpool")
[React](https://react.dev/)
[TanStack Query](https://tanstack.com/query/latest)
[Redux-Toolkit](https://redux-toolkit.js.org/)
[React/Redux](https://react-redux.js.org/)
[React-Router-Dom](https://reactrouter.com/)
