import axios from "axios";
import BASE_URL from "../../baseURL";

const deletePost = async (id) => {
    if (!id) {
        throw new Error("Не передан ID поста для удаления");
    }
    try{
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.delete(
            `${BASE_URL}/api/posts/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
        console.log("Post deleted:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error deleting post:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default deletePost;