import styles from "./homePage.module.css"
import ActionButton from "./../../components/UI/actionButton/ActionButton";
import SearchField from "../../components/UI/searchField/SearchField";
import Stars from "../../components/UI/starsActive/Stars";
import AnswerField from "../../components/UI/answerField/AnswerField";
import RegisterForm from "../../components/UI/regForm/RegForm";
import LoginForm from "../../components/UI/logInForm/LoginForm";
import StarsDumb from "../../components/UI/starsDumb/StarsDumb";
import Review from "../../components/review/Review";
import Reply from "../../components/reply/Reply";
import CafeCard from "../../components/cafeCard/CafeCard";
import CafeListCard from "../../components/cafeListCard/CafeListCard";
import Question from "../../components/question/Question";
import PrepodCard from "../../components/prepodCard/PrepodCard";
import soup from "./../../assets/jpg/cafe_categories/soup.jpg"
const data = {
    "category_id": 1,
    "author_id": 1,
    "name": "Здесь имя",
    "body": "Очень структурированная подача материала, удобно конспектировать. Тем не менее сначала может быть сложно",
    "likes": 3423,
    "dislikes": 888,
    "comments": 232,
}

const data2 = {
    "category_id": 1,
    "author_id": 1,
    "name": "Здесь имя",
    "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
    "likes": 3423,
    "dislikes": 888,
    "comments": 232,
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

const HomePage = () => {
    return (<>
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
            <Question data={data2}></Question>
            <PrepodCard data={data1}></PrepodCard>
    </>);
}

export default HomePage;