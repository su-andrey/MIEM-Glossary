import axios from "axios";
import { BASE_URL } from "../../config";

const getMe = async () => {
    let token = localStorage.getItem("token");
    try{
        const response = await axios.get(`${BASE_URL}/api/me`, 
                                            {headers:{
                                                Authorization: `Bearer ${token}`,
                                        }},);
        return response.data;

    } 
    catch(error){
        console.error("Error getting info about myself:", error.response?.data?.error || error.message);
        return false;
    }
};

export default getMe;