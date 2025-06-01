import requirePosts from "../../queries/GET/requirePosts";
import { refreshStoragePost } from "../mainSlice";
const updatePost = async ({dispatch, postID})=>{
    try{    
        if(!postID){
            throw new Error("Невалидное значение ID поста")
        }
        const new_post = await requirePosts(postID)
        if(!new_post){
            throw new Error("Ошибка получения поста с серва")
        }
        dispatch(refreshStoragePost({postID, new_post}))
        console.log("post synchronized sucessfully")
        return new_post;
    }
    catch(error){
        console.error(error)
        return error
    }
}

export default updatePost;