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
import requirePosts from "../../queries/GET/requirePosts";
import { addLikes, addDislikes } from "../../store/mainSlice";
import EditPostButton from "../UI/editPostButton/EditPostButton";
import DeletePostButton from "../UI/deletePostButton/DeletePostButton";
import { useNavigate } from "react-router-dom";
import Loader1 from "../UI/loader1/Loader1";
const Question = ({data}) => {
    const navigate = useNavigate();
    const postID = data?.id;
    const [name, setName] = useState("");
    const post = useSelector(state => state.main.posts.find(post => post.id == postID));
    const likes = post?.likes ?? 0;
    const dislikes = post?.dislikes ?? 0;
    const [reaction, setReaction] = useState(null);
    const dispatch = useDispatch();
    let init;
    useEffect(()=>{setName(useNameGenerator())}, []);

    useEffect(()=>{
        const requireLike = async ()=> {
            if(data == undefined || data?.id == undefined || !data?.id || !data){
                return;
            }
            init = await requireReaction(data?.id)
            const post = await requirePosts(data?.id)
            if(init===null){
                setReaction(null)
            }
            else{
                setReaction(init.reaction)
            }
        }
        if(data!=undefined && data?.id){
            requireLike();
        }
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

    if(data == undefined || data?.id == undefined || !data?.id || !data){
        return <Loader1 />
    }

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
                    <EditPostButton 
                        oneField={true}
                        data={data}
                        iconSize="2vw"
                    />
                    <DeletePostButton
                        data={data}
                        iconSize="2.5vw"
                    />
                </div>
        </div>
);}

export default Question;