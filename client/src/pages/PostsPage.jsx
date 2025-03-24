import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { BASE_URL } from '../config';

function Posts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(BASE_URL + '/posts');
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

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(BASE_URL + '/categories');
      return res.json();
    }
  });

  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');

  const queryClient = useQueryClient();

  const { mutate: createPost } = useMutation({
    mutationKey: ['createPost'],
    mutationFn: async (e) => {
      e.preventDefault();
      if (!authorId || !categoryId || !name || !body) return alert('Заполните все поля!');

      const postData = {
        author_id: Number(authorId),
        category_id: Number(categoryId),
        name,
        body,
      };

      const res = await fetch(BASE_URL + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setAuthorId('');
      setCategoryId('');
      setName('');
      setBody('');

      queryClient.invalidateQueries(['posts']);
      return data;
    }
  });

  const [editPostId, setEditPostId] = useState('');
  const [editAuthorId, setEditAuthorId] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editName, setEditName] = useState('');
  const [editBody, setEditBody] = useState('');

  const { mutate: updatePost } = useMutation({
    mutationKey: ['updatePost'],
    mutationFn: async (e) => {
      e.preventDefault();
      if (!editAuthorId || !editCategoryId || !editName || !editBody) return alert('Заполните все поля!');

      const postData = {
        author_id: Number(editAuthorId),
        category_id: Number(editCategoryId),
        name: editName,
        body: editBody,
      };

      const res = await fetch(`${BASE_URL}/posts/${editPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setEditPostId('');
      setEditAuthorId('');
      setEditCategoryId('');
      setEditName('');
      setEditBody('');

      queryClient.invalidateQueries(['posts']);
      return data;
    }
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: async (id) => {
      await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' });
    }, 
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    },
  })

  if (isLoading) return <p>Загрузка..</p>

  return (
    <div>
      <h1>Посты</h1>

      <h2>Создать пост</h2>
      <form onSubmit={createPost}>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Выберите категорию</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <br />
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="">Выберите автора</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <br />
        <input
          type="text"
          placeholder="Заголовок поста"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Текст поста"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <br />
        <button type="submit">Создать пост</button>
      </form>

      {editPostId && (
        <div>
          <h2>Редактировать пост</h2>
          <form onSubmit={updatePost}>
            <select
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)}
            >
              <option value="">Выберите категорию</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <br />
            <input
              type="text"
              placeholder="Заголовок поста"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <br />
            <textarea
              placeholder="Текст поста"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <br />
            <button type="submit">Обновить</button>
          </form>
        </div>
      )}

      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.name}</h3>
          <p>{post.body}</p>
          <p>Категория: {post.category.name}</p>
          <p>ID автора: {post.author_id}</p>
          <button onClick={() => { 
            setEditPostId(post.id); 
            setEditName(post.name); 
            setEditBody(post.body); 
            setEditCategoryId(post.category.id); 
            setEditAuthorId(post.author_id); 
          }}>Редактировать</button>
          <button onClick={() => deletePost(post.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}

export default Posts;