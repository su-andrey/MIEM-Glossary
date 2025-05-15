import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const createComment = async (post_id, author_id, body) => {
    if(!post_id){
        throw new Error("Invalid post id");
    }
    else if(!author_id){
        throw new Error("Invalid author id");
    }
    else if(!body){
        throw new Error("Invalid body");
    }
    const data ={
                    post_id : post_id,
                    author_id : author_id,
                    body : body,
                } 
    try{
        const response = await axios.post(`${BASE_URL}/comments`, data);
        console.log("Comment added:", response.data);
        return response.data;
    }
    catch(error) {
        console.error("Error creating comment:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createComment;