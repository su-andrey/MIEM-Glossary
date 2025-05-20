import axios from "axios";
import BASE_URL from "../../baseURL";

const getMe = async () => {
    let token = localStorage.getItem("token");
    try{
        const response = await axios.get(`${BASE_URL}/api/me`, 
                                            {headers:{
                                                Authorization: `Bearer ${token}`,
                                        }},);
        console.log("Self information recieved:", response);
        return response.data;

    } 
    catch(error){
        console.error("Error getting info about myself:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default getMe;