import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Header from './components/header/Header';
import AnimatedSearchField from './components/UI/animatedSearchField/AnimatedSearchField.jsx';
import ActionButton from './components/UI/actionButton/ActionButton.jsx';
import SearchField from './components/UI/searchField/SearchField.jsx';
import Stars from './components/UI/starsActive/Stars.jsx';
import AnswerField from './components/UI/answerField/AnswerField.jsx';
import RegisterForm from './components/UI/regForm/RegForm.jsx';
import LoginForm from './components/UI/logInForm/LoginForm.jsx';
import StarsDumb from './components/UI/starsDumb/StarsDumb.jsx';
import Review from './components/review/Review.jsx';
import Reply from './components/reply/Reply.jsx';
import CafeCard from './components/cafeCard/CafeCard.jsx';
import soup from './assets/jpg/cafe_categories/soup.jpg';
import CafeListCard from './components/cafeListCard/cafeListCard.jsx';
const data = {
    "category_id": 1,
    "author_id": 1,
    "name": "Здесь имя",
    "body": "Очень структурированная подача материала, удобно конспектировать. Тем не менее сначала может быть сложно",
    "likes": 3423,
    "dislikes": 888
}

const data1 = {
    category_id: 2,
    author_id: 1,
    name: "Здесь имя",
    body: "Jeffrey`s",
    image: soup,
    likes: 3423,
    dislikes: 888,
}

const cafeCategories = [
    {
        title: "Кофе и еда",
        image: soup,
    },
    {
        title: "Фастфуд и шаурма",
        image: soup,
    },
    {
        title: "Копирки",
        image: soup,
    },
    {
        title: "Магазины",
        image: soup,
    },
]

const singleCategory = {
    title: "Кофе и еда",
    image: soup,
}

const App = () => {
    return (<>
    <Header></Header>
    <ActionButton text="Нажми меня"></ActionButton>
    <SearchField></SearchField>
    <Stars></Stars>
    <AnswerField></AnswerField>
    <RegisterForm></RegisterForm>
    <LoginForm></LoginForm>
    <StarsDumb defaultRating={3}></StarsDumb>
    <Review data={data}></Review>
    <Reply data={data}></Reply>
    <CafeCard props={singleCategory}></CafeCard>
    <CafeListCard data={data1}></CafeListCard>
    </>);
}

export default App;