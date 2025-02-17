import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './App.css'
import { useState } from 'react'

export const BASE_URL = "http://localhost:3000/api" /* экспорт константы базовой ссылки для получения и отправки api */

function App() {
  // Тут показаны функции взаимодействия с API на примере комментариев к постам. постараюсь снабдить комментами максимально подробно. 
  const { data: comments, isLoading } = useQuery({ // Инициализируем функцию, которая будет получать нам массив comments
    queryKey: ["comments"], // по какому псевдониму вызывать функцию внутри другой функции (позже будет использовано)
    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/comments`) // отправляем запрос с методом GET (задан по умолчанию) на BASE_URL + /comments
        const data = await res.json() // ожидаем ответа

        if (!res.ok) { // в случае, если встроенный статус ответа .ok отрицательный
          throw new Error(data.error || "Something went wrong")
        }

        console.log(data) // в консоли увидим данные в чистом виде, как они приходят от сервера

        return data || [] // если дата есть, возвращаешь, иначе возвращаешь пустой массив
      } catch (error) {
        console.log(error) // вывод в консоль ошибки при наличии
      }
    }
  })

  const [author_id, setAuthorId] = useState(""); // считываем значения полей формы создания коммента
  const [body, setBody] = useState("");
  const [post_id, setPostId] = useState("");

  const queryClient = useQueryClient(); // инициализируем штуку, которая будет управлять кэшированием, нужным для асинхронности

  const { mutate: createComment, isPending: isCreating } = useMutation({ // инициализиурем мутацию- функцию, которая будет изменять состояние чего-либо (создавать, обновлять, удалять)
    mutationKey: ["createComment"],
    mutationFn: async (e) => {
      e.preventDefault(); // отключаем отправку формы, по умолчанию перезагружающее страницу
      if (!author_id || !body || !post_id) return alert("Заполните все поля!"); // очев

      const commentData = { // создаем массив из данных, которые позже улетят в json-тело запроса. !название тэга будет выглядеть как название переменной в кавычках!
        author_id: Number(author_id), // Приводим к числу
        body,
        post_id: Number(post_id), // Приводим к числу
      };

      console.log("Отправляемые данные:", commentData); // увидим данные перед отправкой

      try {
        const res = await fetch(BASE_URL + `/comments`, { // аналогично получению пользователей отправляешь запрос, но уже с параметрами
          method: "POST", // метод отправки
          headers: { "Content-Type": "application/json" }, // нужно для бэка, чтобы распознать намерения запроса. разрешенные хеддеры прописаны в main.go в корневой папке
          body: JSON.stringify(commentData), // передаем в качестве тела запроса массив данных, приведенный к формату JSON. !если формат поля в БД - число, нужно для начала привести полученное значение к числу. так же работает и с bool!
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setAuthorId("");
        setBody("");
        setPostId(""); // обнуляем значения полей
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] }); // в случае успеха асинхронно вызываем функцию, получающую список комментов
    },
    onError: (error) => {
      alert(error.message); // в случае ошибки выводим ошибку
    },
  });

  const [comment_id, setCommentId] = useState("");

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationKey: ["updateComment"],
    mutationFn: async () => {
      try {
        const resComment = await fetch(`${BASE_URL}/comments/${comment_id}`); // получаем коммент, который мы будем изменять. нужно это по той причине, что БД обновляет все поля записи, а не только те, что мы передаем. поэтому нужно сначала передать начальное состояние, изменив лишь нужные поля
        if (!resComment.ok) throw new Error("Failed to fetch user data");

        const currentComment = await resComment.json(); // получаем редактируемый коммент

        const res = await fetch(`${BASE_URL}/comments/${comment_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...currentComment,
            likes: currentComment.likes + 1
          }), // тут мы разворачиваем массив currentComment на отдельные поля, а нужное нам указываем второй раз. выполнится последнее упоминание поля в теле запроса
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    }
  });

  const { mutate:deleteComment, isPending:isDeleting } = useMutation({
    mutationKey:["deleteComment"],
    mutationFn: async () => {
        try {
            const res = await fetch(`${BASE_URL}/comments/${comment_id}`, {
                method:"DELETE" // для удаления тело не требуется, хеддерсы опциональны, а вот метод необходим
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["comments"]})
    }    
})
// выше мы в каждой функции также объявляли переменную вида is{Action} (isCreating, isUpdating и тд)
// эти переменные истинны напротяжении всей функции и ложны после ее завершения. соответственно можно исполнять следующие фокусы:
  return (
    <>
      <form onSubmit={createComment}>
        <input type="number" placeholder='author_id' onChange={(e) => setAuthorId(e.target.value)} /><br />
        <input type="number" placeholder='post_id' onChange={(e) => setPostId(e.target.value)} /><br />
        <input type="text" placeholder='body' onChange={(e) => setBody(e.target.value)} /><br />
        <button type="submit">{!isCreating ? "Create comment" : "The comment is creating.."}</button>
      </form>
      {isLoading && (
        <p>Loading..</p>
      )}
      {!isLoading && comments?.length === 0 && (
        <p>There are no comments yet!</p>
      )}
      <p>Комментарии</p>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <hr />
          <h3>Post</h3>
          <p>ID: {comment.post.id}</p>
          <p>Category: {comment.post.category.name}</p>
          <p>Name: {comment.post.name}</p>
          <p>Body: {comment.post.body}</p>
          <p>Likes: {comment.post.likes}</p>
          <p>Dislikes: {comment.post.dislikes}</p>
          <h3>Comment</h3>
          <p>ID: {comment.id}</p>
          <p>Author ID: {comment.author_id}</p>
          <p>Body: {comment.body}</p>
          <p>Likes: {comment.likes}</p>
          <p>Dislikes: {comment.dislikes}</p>
          <button onClick={() => { setCommentId(comment.id); updateComment()}}>{!isUpdating ? "Like" : "Updating.." }</button>
          <button onClick={() => { setCommentId(comment.id); deleteComment()}}>{!isDeleting ? "Delete" : "Deleting.." }</button>
        </div>
      ))}
    </>
  )
}

// на этом все, добавлю лишь, что BASE_URL экспортируется вниз по иерархии и доступна либо по относительной ссылке, либо по абсолютной (@/App). У меня абсолютная ссылка почему-то не работает
export default App
