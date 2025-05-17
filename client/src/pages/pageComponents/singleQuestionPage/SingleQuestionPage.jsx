import styles from "./singleQuestionPage.module.css"
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Question from "../../../components/question/Question";
import { Link } from "react-router-dom";
import { uid } from "uid";
import AnswerField from "../../../components/UI/answerField/AnswerField";
import Reply from "../../../components/reply/Reply";
import { useParams } from "react-router-dom";
import getPostsByID from "../../../store/selectors/getPostByID";
import getCommentsByQuestionID from "../../../store/selectors/forSinglePages/getCommentsByQuestionID";
import getCategories from "../../../store/selectors/getCategories";
import getPostsByCategory from "../../../store/selectors/getPostsByCategoryID";
import Scroll from "../../../components/UI/scrollButton/Scroll";
import Loader from "../../../components/UI/loader/Loader";
const SingleQuestionPage = () => {
    const data2 = [{
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    },
    {
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    },
    {
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    },
    {
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    },
    {
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    },
    {
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    },
    {
        "author_id": 1,
        "post": 
        {
            "author_id": 1,
            "body": "string",
            "category": 
                {
                    "id": 2, 
                    "name": "string"
                },
            "dislikes": 1,
            "id": 1,
            "likes": 3,
            "name": "string",
        },
        "name": "Здесь имя",
        "body": "Ребят, а чо делать, если сидишь на физике, сам русский, лектор русский, говорит на русском, а понимаю я на армянском. Это лечится?",
        "likes": 3423,
        "dislikes": 888,
        "comments": 232,
    }]

    let categories = useSelector(state => getCategories(state));
    let category = categories.find((category) => category.name == "Вопрос");
    let questions = useSelector(state => getPostsByCategory(state, category.id));
    const questionID = useParams().id;
    const question = useSelector(state => getPostsByID(state, questionID));
    console.log(questionID)
    console.log("Вопрос: ", question)
    /*
    const comments = useSelector(state => getCommentsByQuestionID(state, questionID))
    console.log(comments)
    */
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
                <div className={styles.wholeWrapper}>
                    <div className={styles.topWrapper}>
                        <div>
                            <div className={styles.title}>
                                Вопросы и ответы
                            </div>
                            <div className={styles.caption}>
                                Нужно помочь бедолаге!
                            </div>
                        </div>
                        <div className={styles.textWrapper}>
                            <div className={styles.subtitle}>
                                Вопрос:
                            </div>
                            <Question  data={question}/>
                        </div>
                        <div className={styles.textWrapper}>
                            <div className={styles.subtitle}>
                                Ответы:
                            </div>
                            <div className={styles.sliderWrapper}>
                                {
                                    data2.map((comment)=>{
                                        return(
                                            <Reply key={uid()} data={comment}></Reply>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <AnswerField 
                        settings={{marginTop:'16vh'}}
                        width={"40vw"} 
                        height={"30vh"}
                        placeholder={"Поможете бедолаге?"}
                        caption={"Добавте ответ на вопрос"}
                    />
                </div>
            </div>
        </>
);}


export default SingleQuestionPage;