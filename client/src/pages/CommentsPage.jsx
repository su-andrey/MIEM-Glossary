import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_ENV === "production" || import.meta.env.VITE_ENV === undefined ? "/api" : import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_API_PORT + "/api";

function Comments() {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const res = await fetch(BASE_URL + '/comments');
      if (!res.ok) throw new Error('Ошибка загрузки комментариев');
      return res.json();
    }
  });

  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(BASE_URL + '/posts');
      if (!res.ok) throw new Error('Ошибка загрузки постов');
      return res.json();
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(BASE_URL + '/users');
      return res.json();
    }
  });

  const [authorId, setAuthorId] = useState('');
  const [body, setBody] = useState('');
  const [postId, setPostId] = useState('');

  const queryClient = useQueryClient();

  const { mutate: createComment } = useMutation({
    mutationKey: ['createComment'],
    mutationFn: async (e) => {
      e.preventDefault();
      if (!authorId || !body || !postId) return alert('Заполните все поля!');

      const commentData = {
        author_id: Number(authorId),
        body,
        post_id: Number(postId),
      };

      const res = await fetch(BASE_URL + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при создании комментария');

      setAuthorId('');
      setBody('');
      setPostId('');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
    onError: (error) => {
      alert(error.message);
    }
  });


  const [editCommentId, setEditCommentId] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editPostId, setEditPostId] = useState('');
  const [editLikes, setEditLikes] = useState('');
  const [editDislikes, setEditDislikes] = useState('');

  // Обновление (лайк) комментария
  const { mutate: updateComment } = useMutation({
    mutationKey: ['updateComment'],
    mutationFn: async (e) => {
      e.preventDefault();
      if (!editBody) return alert('Заполните все поля!');

      const commentData = {
        body: editBody,
        post_id: Number(editPostId),
        likes: Number(editLikes),
        dislikes: Number(editDislikes),
      };

      const res = await fetch(`${BASE_URL}/comments/${editCommentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при создании комментария');

      setEditCommentId('');
      setEditBody('');
      setEditPostId('');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  // Удаление комментария
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteComment'],
    mutationFn: async (id) => {
      const res = await fetch(`${BASE_URL}/comments/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при удалении комментария');

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    }
  });

  if (isLoading) return <p>Загрузка...</p>

  return (
    <div>
      <h1>Комментарии</h1>

      <h2>Создать комментарий</h2>
      <form onSubmit={createComment}>
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="">Выберите автора комментария</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <br />
        <select value={postId} onChange={(e) => setPostId(e.target.value)}>
          <option value="">Выберите пост, к которому относится комментария</option>
          {posts?.map((post) => (
            <option key={post.id} value={post.id}>
              {post.name}
            </option>
          ))}
        </select>
        <br />
        <input
          type="text"
          placeholder="Текст комментария"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <br />
        <button type="submit">Создать комментарий</button>
      </form>

      {editCommentId && (
        <div>
          <h2>Редактировать комментарий</h2>
          <form onSubmit={updateComment}>
            <input
              type="text"
              placeholder="Текст комментария"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <br />
            <input
              type="number"
              placeholder="Лайки"
              value={editLikes}
              onChange={(e) => setEditLikes(e.target.value)}
            />
            <br />
            <input
              type="number"
              placeholder="Дизлайки"
              value={editDislikes}
              onChange={(e) => setEditDislikes(e.target.value)}
            />
            <br />
            <button type="submit">Обновить</button>
          </form>
        </div>
      )}

      {comments?.map((comment) => (
        <div key={comment.id}>
          <h2>Комментарий к посту "{comment.post.name}"</h2>
          <p>Текст поста: {comment.body}</p>
          <p>Лайки: {comment.likes}</p>
          <p>Дизлайки: {comment.dislikes}</p>
          <button onClick={() => { 
            setEditCommentId(comment.id); 
            setEditBody(comment.body);
            setEditLikes(comment.likes);
            setEditDislikes(comment.dislikes);  
          }}>Редактировать</button>
          <button onClick={() => deleteComment(comment.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}

export default Comments;