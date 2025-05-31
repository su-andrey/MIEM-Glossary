import styles from "./deletePostButton.module.css"
import trash from "./../../../assets/vectors/edit/delete.svg"
import edit from "./../../../assets/vectors/edit/edit.svg"
import EditPostModal from "../editPostModal/EditPostModal";
import { useState, useEffect } from "react";
import editPost from "../../../queries/PUT/editPost";
import deletePost from "../../../queries/DELETE/deletePost";
import { deleteStoragePost, refreshStoragePost } from "../../../store/mainSlice";
import { setChanged } from "../../../store/mainSlice";
import refreshStorage from "../../../store/refreshers/refreshStorage";
import { useDispatch } from "react-redux";
import { FaRegCircleCheck } from "react-icons/fa6";
import updatePost from "../../../store/refreshers/updatePost";
import createPhotos from "../../../queries/POST/createPhotos";
import requirePosts from "../../../queries/GET/requirePosts";
import getMe from "../../../queries/USER/getMe";
import { useNavigate } from "react-router-dom";
const DeletePostButton = ({data, adminVersion, iconSize}) => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1)
    };

    const [userID, setUserID] = useState(null);
    const [me, setMe] = useState(null);
    useEffect(()=>{
        const asyncGetMe = async ()=>{
            try {
                const me = await getMe();
                setUserID(me.id)
                setMe(me)
            } catch (error) {
                console.error(error)
            }
        }
        asyncGetMe();
    }, [])

    const demolishPost = async (e)=> {
        e.preventDefault();
        e.stopPropagation();

        await deletePost(data?.id)
        dispatch(deleteStoragePost({postID: data?.id}))


    }

    return (
        <>
            {
                (data?.author_id==userID || me?.is_admin) &&
                <img 
                    src={trash} 
                    alt="delete button" 
                    onClick={(e)=>{demolishPost(e)}} 
                    style={{width:`${iconSize}`}} 
                    className={styles.trash}
                />
            }
        </>
    );
}

export default DeletePostButton;