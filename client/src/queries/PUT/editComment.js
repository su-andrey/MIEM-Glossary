import axios from "axios";
import BASE_URL from "../../baseURL";

const editComment = async (body, id, post_id, author_id) => {
    if(!id || !body || !post_id || !author_id){
        throw new Error("Missing required comment fields");
    }

    const data = { body, post_id, author_id };

    try{
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.put(
            `${BASE_URL}/api/comments/${id}`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Comment edited:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error editing comment:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editComment;