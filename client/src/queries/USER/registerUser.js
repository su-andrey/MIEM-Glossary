import axios from "axios";
import { BASE_URL } from "../../config";

const registerUser = async (email, password) => {
    if (!email || !password) {
        throw new Error("Missing required user fields");
    }

    const data = { email, password };

    try{
        const response = await axios.post(`${BASE_URL}/auth/register`, data);
        //console.log("User registered:", response.data);
        localStorage.setItem("token", response.data.token);
        return response.data;

    } 
    catch(error){
        console.error("Error registering user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default registerUser;