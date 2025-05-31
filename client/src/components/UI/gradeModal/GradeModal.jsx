import styles from "./gradeModal.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useState, useEffect } from "react";
import { uid } from "uid";
import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Stars from "../starsActive/Stars";
import requireReaction from "../../../queries/GET/requireReaction";
import { useDispatch } from "react-redux";
import createReaction from "../../../queries/POST/createReaction";
import { addLikes, addDislikes } from "../../../store/mainSlice";
import requirePosts from "../../../queries/GET/requirePosts";


const GradeModal = ({sender, opened, setOpened, postID}) => {
    let userID = useSelector(state => state.main.userID)
    const post = useSelector(state => state.main.posts.find(post => post.id == postID));
    const likes = post?.likes ?? 0;
    const dislikes = post?.dislikes ?? 0;
    const [reaction, setReaction] = useState(null);
    const handleClose = () => {
        setOpened(false)
    }
    const dispatch = useDispatch();
    let init;



    useEffect(()=>{
        const requireLike = async ()=> {
            init = await requireReaction(postID)
            console.log("Получили изначальную реакцию с серва:", init)
            const post = await requirePosts(postID)
            setReaction(init)
        }
        requireLike();
    }, [])
    

    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const initial = reaction
            if(initial === null){
                await createReaction({ post_id: postID, reaction: true });
                dispatch(addLikes({ postID , reaction: 1}));
                dispatch(addDislikes({ postID , reaction: 0}));
                setReaction(true)
            }
            else if(initial === true){
                await createReaction({ post_id: postID, reaction: null });
                dispatch(addLikes({ postID , reaction: -1}));
                dispatch(addDislikes({ postID , reaction: 0}));
                setReaction(null)
            }
            else if(initial === false){
                await createReaction({ post_id: postID, reaction: true });
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
                await createReaction({ post_id: postID, reaction: false });
                dispatch(addLikes({ postID , reaction: 0}));
                dispatch(addDislikes({ postID , reaction: 1}));
                setReaction(false)
            }
            else if(initial === true){
                await createReaction({ post_id: postID, reaction: false });
                dispatch(addLikes({ postID , reaction: -1}));
                dispatch(addDislikes({ postID , reaction: 1}));
                setReaction(false)
            }
            else if(initial === false){
                await createReaction({ post_id: postID, reaction: null });
                dispatch(addLikes({ postID , reaction: 0}));
                dispatch(addDislikes({ postID , reaction: -1}));
                setReaction(null)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e)=>{
        try{
            if(reaction == null){
                handleClose()
            }
            else if(reaction == true){
                await handleLikeClick(e)
                handleClose()
            }
            else if(reaction == false){
                await handleDislikeClick(e)
                handleClose()
            }
        }
        catch(error){
            console.error(error)
        }
    }

    return ( 
        <>
            {opened && <div className={styles.background}>
                <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
                    <MdOutlineCancel className={styles.cancel} onClick={()=>{handleClose()}} />
                    <div className={styles.title}>Оцените пост</div>
                    {userID && 
                        <>
                            <Stars iconSize={"3"} sender={setReaction} />
                            <ActionButton text="Отправить" onClick={(e)=>handleSubmit(e)}/>
                        </>
                    }
                    {!userID && 
                        <>
                            <div className={styles.subtitle}>Войдите, чтобы добавлять оценки</div>
                            <Link to="/login"><ActionButton text="Вход"/></Link>
                        </>
                    }
                </div>
            </div>}
        </>
    );
}

export default GradeModal;