import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/HomePage';
import Categories from './pages/CategoriesPage';
import Users from './pages/UsersPage';
import Posts from './pages/PostsPage';
import Comments from './pages/CommentsPage';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/categories">Категории</Link>
        <Link to="/users">Пользователи</Link>
        <Link to="/posts">Посты</Link>
        <Link to="/comments">Комментарии</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/users" element={<Users />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/comments" element={<Comments />} />
      </Routes>
    </div>
  );
}

export default App;