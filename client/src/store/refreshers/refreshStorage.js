import { setComments, setPosts } from "../mainSlice";
import requireComments from "../../queries/GET/requireComments";
import requirePosts from "../../queries/GET/requirePosts";

const refreshStorage = async (dispatch)=>{
    try {
        const posts = await requirePosts();
        const comments = await requireComments();
        localStorage.removeItem('persist:root')
        dispatch(setPosts({ data: posts }));
        dispatch(setComments({ data: comments }));
        //console.log("Storage rebuilt");
    } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
    }
}

export default refreshStorage;