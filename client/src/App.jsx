import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Header from './components/header/Header';
import AnimatedSearchField from './components/UI/animatedSearchField/AnimatedSearchField.jsx';
import ActionButton from './components/UI/actionButton/ActionButton.jsx';
import SearchField from './components/UI/searchField/SearchField.jsx';
import Stars from './components/UI/stars/Stars.jsx';
import AnswerField from './components/UI/answerField/AnswerField.jsx';
import RegisterForm from './components/UI/regForm/RegForm.jsx';
import LoginForm from './components/UI/logInForm/LoginForm.jsx';

const App = () => {
    return (<>
    <Header></Header>
    <ActionButton text="Нажми меня"></ActionButton>
    <SearchField></SearchField>
    <Stars></Stars>
    <AnswerField></AnswerField>
    <RegisterForm></RegisterForm>
    <LoginForm></LoginForm>
    </>);
}

export default App;