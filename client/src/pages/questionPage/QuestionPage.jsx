import styles from "./questionPage.module.css"
import { useSelector } from "react-redux";
import getCategories from "../../store/selectors/getCategories";
import getPostsByCategory from "../../store/selectors/getPostsByCategoryID";
import Question from "../../components/question/Question";
import { Link } from "react-router-dom";
import { uid } from "uid";
import AnswerField from "../../components/UI/answerField/AnswerField";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Scroll from "../../components/UI/scrollButton/Scroll";
import Loader from "../../components/UI/loader/Loader";
import { useState, useEffect } from "react";
const QuestionPage = () => {
    let categories = useSelector(state => getCategories(state))
    console.log(categories)
    let category = categories.find((category) => category.name == "Вопрос")
    console.log(category)
    let questions = useSelector(state => getPostsByCategory(state, category.id))
    console.log(questions)
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const handleLoad = () => setReady(true);
    if (document.readyState === 'complete') {
        handleLoad();
    } 
    else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }
    }, []);
    if (!ready) return <Loader/>;
    return(
        <>
            <Scroll />
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.textWrapper}>
                        <div className={styles.title}>
                            Вопросы и ответы
                        </div>
                        <div className={styles.caption}>
                            Выберите интересующую тему
                        </div>
                    </div>
                </div>
                <div className={styles.wholeWrapper}>
                    <div className={styles.sliderWrapper}>
                            {questions.map((post) => (
                                <SwiperSlide key={uid()}>
                                    <Link to={`/questions/${post.id}`}>
                                        <Question data={post} />
                                    </Link>
                                </SwiperSlide>
                            ))}
                    </div>
                    <AnswerField 
                        settings={{marginTop:'-5vh'}}
                        width={"40vw"} 
                        height={"30vh"}
                        placeholder={"Спросите что-нибудь?"}
                        caption={"Создайте собственное обсуждение"}
                    />
                </div>
            </div>
        </>
);}


export default QuestionPage;