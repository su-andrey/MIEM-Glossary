import styles from "./singleQuestionPage.module.css"
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Question from "../../../components/question/Question";
import { Link, useNavigate } from "react-router-dom";
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
import { addComment, refreshStoragePost } from "../../../store/mainSlice";
import ActionButton from "../../../components/UI/actionButton/ActionButton";
import CreateCommentModal from "../../../components/UI/createCommentModal/CreateCommentModal";
import updatePost from "../../../store/refreshers/updatePost";
import NoPostsCard from "../../../components/noPostsCard/NoPostsCard";

const SingleQuestionPage = () => {
    const navigate = useNavigate()
    let categories = useSelector(state => getCategories(state));
    let category = categories.find((category) => category.name == "Вопросы");
    let questions = useSelector(state => getPostsByCategory(state, category.id));
    const questionID = useParams().id;
    const authorID = useSelector(state => state.main.userID)
    //console.log("authorID:", authorID);
    const question = useSelector(state => getPostsByID(state, questionID));
    const dispatch = useDispatch()
    
    useEffect(()=>{
        updatePost({dispatch, postID: questionID})
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

    const comments = question?.comments

    const submitter = async ({ answer, post_id, author_id }) => {
        //console.log("Sending to server:", {
    //             post_id,
    //             author_id,
    //             body: answer,
    // });
    try {
        const response = await createComment({
        post_id,
        author_id: author_id,
        body: answer,
        });
        dispatch(addComment(response));
        await updatePost({dispatch, postID: question.id})
    } 
    catch (error) {
        console.error("Ошибка добавления комментария", error);
    }
    };

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


    if(question===undefined || question.id===undefined || question===null || !question){
        navigate("/questions")
    }
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
                        <div className={styles.logicalBlock}>
                                    <div className={styles.caption} style={{color:"var(--light-grey)"}}>
                                        Оставте свой ответ на вопрос
                                    </div>
                                    <CreateCommentModal
                                        placeholder={"Поможете бедолаге?"}
                                        caption={"Добавьте ответ на вопрос"}
                                        submitter={(answer) => submitter({answer, post_id: questionID, author_id: authorID })}
                                    />
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
                            <div className={styles.gridWrapper}>
                                {(comments!=null && comments.length > 0) ?
                                    comments.map((comment, index)=>{
                                        return(
                                            <motion.div
                                                custom={index%3}
                                                variants={centerItemAnimation}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, amount: 0.5 }}
                                                className={styles.element}
                                                key={comment.id}
                                                style={{
                                                    width:"max-content",
                                                    height: "stretch"
                                                }}
                                            >
                                                <Reply key={uid()} data={comment}></Reply>
                                            </motion.div>
                                        );
                                    })
                                    :
                                    <motion.div
                                        custom={1}
                                        variants={centerItemAnimation}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.5 }}
                                        className={styles.metatitle}
                                        key={uid()}
                                    >
                                        <NoPostsCard text="Пока нет ответов..." />
                                    </motion.div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
);}

export default SingleQuestionPage;