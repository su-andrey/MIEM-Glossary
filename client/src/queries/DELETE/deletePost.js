import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const deletePost = async (post_id) => {
    if (!post_id) {
        throw new Error("Missing required post fields");
    }

    try{
        const response = await axios.delete(`${BASE_URL}/posts/${post_id}`);
        console.log("Post deleted:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error deleting post:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default deletePost;