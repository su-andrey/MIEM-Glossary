import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { BASE_URL } from '../config';

function Users() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(BASE_URL + '/users');
      return res.json();
    }
  });

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [is_admin, setIsAdmin] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: createUser } = useMutation({
    mutationKey: ['createUser'],
    mutationFn: async (e) => {
      e.preventDefault();
      if (!name || !password) return alert('Заполните все поля!');

      const userData = {
        name,
        password,
        is_admin,
      };

      const res = await fetch(BASE_URL + '/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setName('');
      setPassword('');
      setIsAdmin(false);

      queryClient.invalidateQueries(['users']);
      return data;
    }
  });

  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserIsAdmin, setEditUserIsAdmin] = useState(false)

  const { mutate: updateUser } = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();
      if (!editUserName || !editUserPassword) return alert('Заполните все поля!');

      const userData = {
        name: editUserName,
        password: editUserPassword,
        is_admin: editUserIsAdmin,
      };

      const res = await fetch(`${BASE_URL}/users/${editUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }
      return data || [];    
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setEditUserId(null)
      setEditUserName('')
      setEditUserPassword('')
      setEditUserIsAdmin(false)
    }
  })

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id) => {
        await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
      },
      onSuccess: () => {  
        queryClient.invalidateQueries(['users'])
      }
  })

  if (isLoading) return <p>Загрузка..</p>

  return (
    <div>
      <h1>Пользователи</h1>

      <h2>Создать пользователя</h2>
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label>
          Админ:
          <input
            type="checkbox"
            checked={is_admin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Создать пользователя</button>
      </form>

      {editUserId && (
        <div>
          <h2>Редактировать пользователя</h2>
          <form onSubmit={updateUser}>
            <input
              type="text"
              placeholder="Имя"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="Пароль"
              value={editUserPassword}
              onChange={(e) => setEditUserPassword(e.target.value)}
            />
            <br />
            <label>
              Является администратором:
              <input
                type="checkbox"
                checked={editUserIsAdmin}
                onChange={(e) => setEditUserIsAdmin(e.target.checked)}
              />
            </label>
            <br />
            <button type="submit">Обновить</button>
          </form>
        </div>
      )}

      {users?.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>Пароль: {user.password}</p>
          <p>Статус: {user.is_admin ? 'Админ' : 'Пользователь'}</p>
          <button onClick={() => { setEditUserId(user.id); setEditUserName(user.name); setEditUserPassword(user.password); setEditUserIsAdmin(user.is_admin) }}>Редактировать</button>
          <button onClick={() => deleteUser(user.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}

export default Users;