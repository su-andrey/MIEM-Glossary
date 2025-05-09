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
const data = {
    "category_id": 1,
    "author_id": 1,
    "name": "Здесь имя",
    "body": "Очень структурированная подача материала, удобно конспектировать. Тем не менее сначала может быть сложно"
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
    </>);
}

export default App;