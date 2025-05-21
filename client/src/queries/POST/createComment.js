import axios from "axios";
import BASE_URL from "../../baseURL";

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
                    post_id,
                    author_id,
                    body,
                } 
    try{
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.post(
            `${BASE_URL}/api/comments`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Comment added:", response.data);
        return response.data;
    }
    catch(error) {
        console.error("Error creating comment:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createComment;