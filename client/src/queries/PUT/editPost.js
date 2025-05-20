import axios from "axios";
import BASE_URL from "../../baseURL";

const editPost = async (name, author_id, body, category_id, id) => {
    if (!name || !author_id || !body || !category_id || !id) {
        throw new Error("Missing required post fields");
    }

    const data = { name, author_id, body, category_id };

    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.put(
            `${BASE_URL}/api/posts/${id}`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Post edited:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error editing post:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editPost;