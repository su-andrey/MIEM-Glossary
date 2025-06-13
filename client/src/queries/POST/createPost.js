import axios from "axios";
import { BASE_URL } from "../../config";

const createPost = async ({name, author_id, body, category_id}) => {
    if (!author_id || !body || !category_id) {
        throw new Error("Missing required post fields");
    }
    const data = { name, author_id, body, category_id };
    //console.log("sending data", data)
    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.post(
            `${BASE_URL}/api/posts`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        //console.log("Post created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createPost;