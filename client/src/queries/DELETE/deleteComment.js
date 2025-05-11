import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const deleteComment = async (comment_id) => {
    if(!comment_id){
        throw new Error("Missing required comment fields");
    }

    try{
        const response = await axios.delete(`${BASE_URL}/comments/${comment_id}`);
        console.log("Comment deleted:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error deleting comment:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default deleteComment;