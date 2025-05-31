import styles from "./editField.module.css"
import trash from "./../../../assets/vectors/edit/delete.svg"
import edit from "./../../../assets/vectors/edit/edit.svg"
import EditPostModal from "../editPostModal/EditPostModal";
import { useState } from "react";
import editPost from "../../../queries/PUT/editPost";
import deletePost from "../../../queries/DELETE/deletePost";
import { deleteStoragePost } from "../../../store/mainSlice";
import { setChanged } from "../../../store/mainSlice";
import refreshStorage from "../../../store/refreshers/refreshStorage";
import { useDispatch } from "react-redux";
import { FaRegCircleCheck } from "react-icons/fa6";
import updatePost from "../../../store/refreshers/updatePost";
const EditField = ({data, adminVersion}) => {
    const dispatch = useDispatch();
    const sendWholeData = async ({answer, name, photos, author_id, category_id}) => {
        try{
            console.log("sending this to the server:", {name, body: answer, author_id, category_id})
            const response = await editPost({name, body: answer, author_id, category_id})
            await createPhotos({photos, id: response.id})
            const final_post = await requirePosts(response.id)
            dispatch(addPost(final_post))
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
        });
        await updatePost({dispatch, postID: data?.id})
        console.log("Post submitted succesfully")
    }



    return (
    <div className={styles.wrapper}>
        <EditPostModal 
            placeholder={"Отредактируйте пост или напишите заново"}
            caption={"Редактирование поста"}
            sender={({answer, name, photos})=>sendWholeData({answer, name, photos, author_id: data?.author_id, category_id: data?.category?.id})}
        />
        <img src={trash} alt="delete button" onClick={()=>{demolishPost()}} className={styles.trash}/>
        {adminVersion &&
            <FaRegCircleCheck onClick={()=>{submitPost()}} className={styles.yes}/>
        }
    </div>);
}

export default EditField;