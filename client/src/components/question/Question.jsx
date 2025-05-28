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
import { useDispatch, useSelector } from "react-redux";
import { updateReaction } from "../../store/mainSlice";
import requirePosts from "../../queries/GET/requirePosts";
import { addLikes, addDislikes } from "../../store/mainSlice";

const Question = ({data}) => {
    const postID = data.id;
    const [name, setName] = useState("");
    const likes = useSelector(state => state.main.posts.find(
        (post)=> post.id == postID
    ).likes)
    const dislikes = useSelector(state => state.main.posts.find(
        (post)=> post.id == postID
    ).dislikes)
    const [reaction, setReaction] = useState(null);
    const dispatch = useDispatch();
    let init;
    useEffect(()=>{setName(useNameGenerator())}, []);
    useEffect(()=>{
        const requireLike = async ()=> {
            init = await requireReaction(data?.id)
            console.log("Получили изначальную реакцию с серва:", init.reaction)
            const post = await requirePosts(data.id)
            setReaction(init.reaction)
        }
        requireLike();
    }, [])
    

    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const initial = reaction
            if(initial === null){
                await createReaction({ post_id: data.id, reaction: true });
                dispatch(addLikes({ postID , reaction: 1}));
                dispatch(addDislikes({ postID , reaction: 0}));
                setReaction(true)
            }
            else if(initial === true){
                await createReaction({ post_id: data.id, reaction: null });
                dispatch(addLikes({ postID , reaction: -1}));
                dispatch(addDislikes({ postID , reaction: 0}));
                setReaction(null)
            }
            else if(initial === false){
                await createReaction({ post_id: data.id, reaction: true });
                dispatch(addLikes({ postID , reaction: 1}));
                dispatch(addDislikes({ postID , reaction: -1}));
                setReaction(true)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDislikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const initial = reaction
            if(initial === null){
                await createReaction({ post_id: data.id, reaction: false });
                dispatch(addLikes({ postID , reaction: 0}));
                dispatch(addDislikes({ postID , reaction: 1}));
                setReaction(false)
            }
            else if(initial === true){
                await createReaction({ post_id: data.id, reaction: false });
                dispatch(addLikes({ postID , reaction: -1}));
                dispatch(addDislikes({ postID , reaction: 1}));
                setReaction(false)
            }
            else if(initial === false){
                await createReaction({ post_id: data.id, reaction: null });
                dispatch(addLikes({ postID , reaction: 0}));
                dispatch(addDislikes({ postID , reaction: -1}));
                setReaction(null)
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