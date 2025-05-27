import styles from "./question.module.css"
import getFiveScale from "../../custom hooks/useGetFiveScale";
import StarsDumb from "../UI/starsDumb/StarsDumb";
import { useState, useEffect } from "react";
import useNameGenerator from "../../custom hooks/useNameGenerator";
import comment from "./assets/comment/comment.svg"
import like_empty from "./assets/like/like_empty.svg"
import like_filled from "./assets/like/like_filled.svg"
import dislike from "./assets/dislike/dislike.svg"
import dislike_filled from "./assets/dislike/dislike_filled.svg"
import requireReaction from "../../queries/GET/requireReaction";
import createReaction from "../../queries/POST/createReaction";
import refreshPosts from "../../store/refreshers/refreshPosts";
import { useDispatch } from "react-redux";
import { updateReaction } from "../../store/mainSlice";

const Question = ({data}) => {
    const [name, setName] = useState("");
    const [likes, setLikes] = useState(data.likes);
    const [dislikes, setDislikes] = useState(data.dislikes);
    const [reaction, setReaction] = useState(null);
    const dispatch = useDispatch();
    let init;
    useEffect(()=>{setName(useNameGenerator())}, []);
    useEffect(()=>{
        const requireLike = async ()=> {
            init = await requireReaction(data?.id)
            console.log("Получили реакцию с серва:", init)
            setReaction(init)
        }
        requireLike();
    }, [])
    

    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await createReaction({ post_id: data.id, reaction: true });
            dispatch(updateReaction({ postId: data?.id, reaction: true }));
            if (reaction !== true) {
                setLikes(prev => prev + 1);
                if (reaction === false) setDislikes(prev => prev - 1);
                setReaction(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDislikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await createReaction({ post_id: data.id, reaction: false });
            dispatch(updateReaction({ postId: data?.id, reaction: false }));
            if (reaction !== false) {
                setDislikes(prev => prev + 1);
                if (reaction === true) setLikes(prev => prev - 1);
                setReaction(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const countComments = (commentsArray) => {
    if (!Array.isArray(commentsArray)) {
        return 0;
    }
    return commentsArray.length;
    };
    
    return (
        <div className={styles.wrapper}>
                <div className={styles.textWrapper}>
                    <div className={styles.title}>
                        {data.nothing || name}
                    </div>
                    <div className={styles.body}>
                        {data.body}
                    </div>
                </div>
                <div className={styles.commentBlock}>
                    <div onClick={(e)=>{handleLikeClick(e)}} className={styles.comment}>
                        <img src={reaction===true ? like_filled : like_empty} alt="like button" className={styles.like_icon}/>
                        
                        <span className={styles.like_counter}>{likes}</span>
                    </div>
                    <div className={styles.comment}>
                        <img src={comment} alt="comment button" className={styles.comment_icon}/>
                        <span className={styles.comment_counter}>{countComments(data.comments)}</span>
                    </div>
                    <div className={styles.comment} onClick={(e)=>{handleDislikeClick(e)}}>
                        <img src={reaction===false ? dislike_filled : dislike} className={styles.dislike_icon} alt="dislike button" />
                        <span className={styles.dislike_counter}>{dislikes}</span>
                    </div>
                </div>
        </div>
);}

export default Question;