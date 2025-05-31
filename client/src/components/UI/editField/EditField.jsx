import styles from "./editField.module.css"
import trash from "./../../../assets/vectors/edit/delete.svg"
import edit from "./../../../assets/vectors/edit/edit.svg"
import EditPostModal from "../editPostModal/EditPostModal";
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
const EditField = ({data, adminVersion, iconSize}) => {

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };


    const dispatch = useDispatch();
    const sendWholeData = async ({answer, name, photos, author_id, category_id, is_moderated, id, likes, dislikes}) => {
        try{
            console.log("sending this to the server:", {name, body: answer, author_id, category_id, is_moderated})
            const response = await editPost({name, body: answer, author_id, category_id, is_moderated, id})
            await createPhotos({photos, id: response.id})
            const final_post = await requirePosts(response.id)
            dispatch(refreshStoragePost({ postID: id, new_post: final_post }))
        }
        catch(error){
            console.error(error)
        }
    }

    const demolishPost = async ()=> {
        dispatch(deleteStoragePost({postID: data?.id}))
        await deletePost(data?.id)
    }


        const submitPost = async ()=> {
        await editPost({
            name: data.name, 
            author_id: data.author_id, 
            body: data.body, 
            category_id: data.category.id, 
            id: data.id, 
            is_moderated: true,
            likes: data.likes,
            dislikes: data.dislikes,
        });
        await updatePost({dispatch, postID: data?.id})
        console.log("Post submitted succesfully")
        goBack()
    }



    return (
    <div className={styles.wrapper}>
        <EditPostModal 
            placeholder={"Текст нового поста..."}
            caption={"Отредактируйте пост"}
            sender={({answer, name, photos})=>sendWholeData({
                answer, 
                name, 
                photos, 
                author_id: data?.author_id, 
                category_id: data?.category?.id, 
                is_moderated: false, 
                id: data.id,
                likes: data.likes,
                dislikes: data.dislikes,
            })}
            data={data}
            iconSize={iconSize}
        />
        <img src={trash} alt="delete button" onClick={()=>{demolishPost()}} style={{width:`${iconSize}`}} className={styles.trash}/>
        {adminVersion &&
            <FaRegCircleCheck 
                onClick={()=>{submitPost()}} 
                className={styles.yes}
                style={{width:`${iconSize}`}}
            />
        }
    </div>);
}

export default EditField;