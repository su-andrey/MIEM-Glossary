import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../config';

function Categories() {
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/categories`);
      return res.json();
    },
  });

  const { mutate: createCategory } = useMutation({
    mutationFn: async () => {
      await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setNewCategory('');
    },
  });

  const { mutate: updateCategory } = useMutation({
    mutationFn: async () => {
      await fetch(`${BASE_URL}/categories/${editCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCategoryName }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setEditCategoryId(null);
      setEditCategoryName('');
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id) => {
      await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>Категории</h1>

      <h2>Создать категорию</h2>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Название категории"
      />
      <button onClick={() => createCategory()}>Создать</button>

      {editCategoryId && (
        <div>      
          <h2>Редактировать категорию</h2>
          <input
            type="text"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
          <button onClick={() => updateCategory()}>Обновить</button>
        </div>
      )}

      <h2>Список категорий</h2>
      {categories?.map((category) => (
        <div key={category.id}>
          <p>{category.name}</p>
          <button onClick={() => { setEditCategoryId(category.id); setEditCategoryName(category.name); }}>Редактировать</button>
          <button onClick={() => deleteCategory(category.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}

export default Categories;