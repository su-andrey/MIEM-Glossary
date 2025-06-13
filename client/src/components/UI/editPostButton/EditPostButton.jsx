import styles from "./editPostButton.module.css"
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
const EditPostButton = ({data, adminVersion, iconSize, oneField}) => {
    const dispatch = useDispatch();
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

    const sendWholeData = async ({answer, name, photos, author_id, category_id, is_moderated, id, dispatch, likes, dislikes, oneField}) => {
        try{
            //console.log("sending this to the server:", {name, body: answer, author_id, category_id, is_moderated})
            const response = await editPost({name, body: answer, author_id, category_id, is_moderated, id, likes, dislikes})
            await createPhotos({photos, id: response.id})
            const final_post = await requirePosts(response.id)
            await updatePost({dispatch, postID: id})
        }
        catch(error){
            console.error(error)
        }
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
        //console.log("Post submitted succesfully")
    }


    return (
    <>
        {   
            (data?.author_id==userID || me?.is_admin) &&
                <EditPostModal 
                    placeholder={"Текст нового поста..."}
                    caption={"Отредактируйте пост"}
                    sender={({answer, photos})=>sendWholeData({
                        answer, 
                        name:data?.name, 
                        photos, 
                        author_id: data?.author_id, 
                        category_id: data?.category?.id, 
                        is_moderated: false, 
                        id: data?.id,
                        dispatch,
                        likes: data?.likes,
                        dislikes: data.dislikes,
                    })}
                    data={data}
                    iconSize={iconSize}
                    oneField={oneField}
                />
        }
    </>);
}

export default EditPostButton;