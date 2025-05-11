import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const editComment = async (body, comment_id) => {
    if(!comment_id || !body){
        throw new Error("Missing required comment fields");
    }

    const data = { body };

    try{
        const response = await axios.put(`${BASE_URL}/comments/${comment_id}`, data);
        console.log("Comment edited:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error editing comment:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editComment;