import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const createUser = async (email, password, is_admin) => {
    if (!email || !password || !is_admin) {
        throw new Error("Missing required user fields");
    }
    const data = { email, password, is_admin };
    try {
        const response = await axios.post(`${BASE_URL}/users`, data);
        console.log("User created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createUser;