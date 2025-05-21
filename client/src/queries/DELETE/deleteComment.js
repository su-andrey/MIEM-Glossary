import axios from "axios";
import BASE_URL from "../../baseURL";

const deleteComment = async (id) => {
    if(!id){
        throw new Error("Missing required comment fields");
    }
    try{
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.delete(
            `${BASE_URL}/api/comments/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Comment deleted:", response.data);
        return response.data;
    } 
    catch(error){
        console.error("Error deleting comment:", error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Ошибка при удалении комментария");
    }
};

export default deleteComment;