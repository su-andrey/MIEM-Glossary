import axios from "axios";
import { BASE_URL } from "../../config";

const logInUser = async (email, password) => {
    if (!email || !password) {
        throw new Error("Missing required user fields");
    }

    const data = { email, password };

    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, data);
        //console.log(`User logged in. Token received: ${response.data.token}`);
        const token = response?.data?.token;
        if (!token) {
            throw new Error("Token was not returned from server");
        }
        localStorage.removeItem("token");
        localStorage.setItem("token", token);
        return response.data;
    }
    catch (error) {
        console.error("Error logging in user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default logInUser;
