import axios from "axios";
import { BASE_URL } from "../../config";

const createReaction = async ({post_id, reaction}) => {
    if(!post_id){
        throw new Error("Empty post id field");
    }
    const data = 
    {
        reaction,
    } 
    try{
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.post(
            `${BASE_URL}/api/reactions/${post_id}`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        //console.log("Reaction created:", response.data);
        return response.data;
    }
    catch(error) {
        console.error("Error creating reaction:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createReaction;