import requirePosts from "../../queries/GET/requirePosts";
import { setPosts } from "../mainSlice";
const refreshPosts = async (dispatch) => {
    try{
        const new_posts = await requirePosts();
        dispatch(setPosts(new_posts))
    }
    catch(error){
        console.error(error)
        return error
    }
    
}

export default refreshPosts;