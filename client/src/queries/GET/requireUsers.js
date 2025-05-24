import axios from "axios";
import { BASE_URL } from "../../config";

const requireUsers = async (id = "") => {
    try{
        const url = id === "" ? `${BASE_URL}/api/users` : `${BASE_URL}/users/${id}`;
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.get(
            url,
            {headers:{
                Authorization: `Bearer ${token}`
            }}
        );
        console.log("Users received: ",response.data);
        return response.data;
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default requireUsers;