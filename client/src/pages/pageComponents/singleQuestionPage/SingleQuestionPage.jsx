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
import {motion} from "framer-motion"
import Loader1 from "../../../components/UI/loader1/Loader1";
import createComment from "../../../queries/POST/createComment";
const SingleQuestionPage = () => {
    let categories = useSelector(state => getCategories(state));
    let category = categories.find((category) => category.name == "Вопросы");
    let questions = useSelector(state => getPostsByCategory(state, category.id));
    const questionID = useParams().id;
    const question = useSelector(state => getPostsByID(state, questionID));
    const author_id = useSelector(state => state.main.userID)
    
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

    const comments = useSelector(state => getCommentsByQuestionID(state, questionID))
    console.log(comments)

    const submitter = async (data)=>{
        try{
            const response = await createComment({
                post_id: questionID,
                author_id: author_id,
                body: data.answer
            })
            

        }
        catch(error){

        }
    }

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
    if (!ready) return <Loader1 />;
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
                                {comments.size > 0 ?
                                    comments.map((comment)=>{
                                        return(
                                            <motion.div
                                                custom={1}
                                                variants={leftItemAnimation}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, amount: 0.5 }}
                                                className={styles.metatitle}
                                                key={uid()}
                                            >
                                                <Reply key={uid()} data={comment}></Reply>
                                            </motion.div>
                                        );
                                    })
                                    :
                                    <motion.div
                                        custom={1}
                                        variants={leftItemAnimation}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.5 }}
                                        className={styles.metatitle}
                                        key={uid()}
                                    >
                                        <Reply key={uid()} data={{body:"Пока нет ответов(", serv:"Одинокий бедолага"}}></Reply>
                                    </motion.div>
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
                        submitter={()=>{submitter()}}
                    />
                </div>
            </div>
        </>
);}


export default SingleQuestionPage;