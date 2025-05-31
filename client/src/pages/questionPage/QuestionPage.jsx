import styles from "./questionPage.module.css"
import { useDispatch, useSelector } from "react-redux";
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
import {motion} from "framer-motion"
import Loader1 from "../../components/UI/loader1/Loader1";
import createPost from "../../queries/POST/createPost";
import { addPost, setChanged } from "../../store/mainSlice";
import ActionButton from "../../components/UI/actionButton/ActionButton";
import CreateCommentModal from "../../components/UI/createCommentModal/CreateCommentModal";
import AppLoaderWrapper from "../appLoaderWarapper/AppLoaderWrapper";
import refreshStorage from "../../store/refreshers/refreshStorage";
import NoPostsCard from "../../components/noPostsCard/NoPostsCard";
const QuestionPage = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        refreshStorage(dispatch)
    }, [])

    const leftItemAnimation = {
        hidden: {
            opacity: 0,
            x: -100,
        },
        visible: custom => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: custom * 0.3,
                duration: 0.4, 
                ease: "easeOut",
            }
        }),
    }

    let categories = useSelector(state => getCategories(state))
    console.log(categories)
    let category = categories.find((category) => category.name == "Вопросы")
    console.log(category)
    let questions = useSelector(state => getPostsByCategory(state, category.id))
    console.log(questions)
    let authorID = useSelector(state => state.main.userID)
    const [ready, setReady] = useState(false);

        const centerItemAnimation = {
        hidden: {
            opacity: 0,
            y: 100,
        },
        visible: custom => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.3,
                duration: 0.4, 
                ease: "easeOut",
            }
        }),
    }

    const submitter = async ({ answer, category_id, author_id }) => {
        try {
            const response = await createPost({
            name: "question",
            category_id: category_id,
            author_id: author_id,
            body: answer,
            });
            console.log("Ответ серва при создании коммента", response);
            dispatch(addPost(response));
        } 
        catch (error) {
            console.error("Ошибка добавления вопроса", error);
        }
    }

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
    if (!ready) return <Loader1/>;
    return(
        <>
        <AppLoaderWrapper >
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
                    <div className={styles.rightWrapper}>
                        <div className={styles.caption}>
                            Задайте собственный вопрос
                        </div>
                        <CreateCommentModal 
                            placeholder={"Спросите что-нибудь?"}
                            caption={"Создайте собственное обсуждение"}
                            submitter={(answer) => submitter({answer, category_id: category.id, author_id: authorID })}
                        />
                    </div>
                </div>
                <div className={styles.wholeWrapper}>
                    <div className={styles.gridWrapper}>
                            {questions && questions.length > 0 ?
                                (questions
                                    .filter((post) => post !== undefined && post !== null && post)
                                    .map((post, index) => (
                                    <motion.div
                                        custom={index%3}
                                        variants={centerItemAnimation}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.5 }}
                                        className={styles.metatitle}
                                        key={post?.id || uid()}
                                    >
                                        <Link to={`/questions/${post.id}`} >
                                            <Question data={post} />
                                        </Link>
                                    </motion.div>
                                )))
                                :
                                <NoPostsCard  text="Пока нет вопросов("/>
                            }
                    </div>
                </div>
            {authorID &&
                        <div className={styles.subcont}>
                            <div className={styles.caption}>Спросите что-нибудь?</div>
                                <CreateCommentModal 
                                    placeholder={"Спросите что-нибудь?"}
                                    caption={"Создайте собственное обсуждение"}
                                    submitter={(answer) => submitter({answer, category_id: category.id, author_id: authorID })}
                                />
                        </div>
            }
            {!authorID && 
                        <div className={styles.subcont}>
                            <div className={styles.caption}>Войдите в аккаунт чтобы добавлять посты</div>
                            <Link to="/login"><ActionButton text="Авторизоваться"/></Link>
                        </div>
            }
            </div>
        </AppLoaderWrapper>
        </>
);}


export default QuestionPage;