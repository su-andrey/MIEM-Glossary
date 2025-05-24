import axios from "axios";
import { BASE_URL } from "../../config";


const requireReaction = async (id) => {
    try{
        if(!id){
            throw new Error("Missing post id field");
        }
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const url = `${BASE_URL}/api/reactions/${id}`;
        const response = await axios.get(
            url,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Reaction received: ",response.data);
        return response.data;
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default requireReaction;