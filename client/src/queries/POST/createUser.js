import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const createUser = async (name, author_id, password, is_admin) => {
    if (!name || !author_id || !password || !is_admin) {
        throw new Error("Missing required post fields");
    }

    const data = { name, author_id, password, is_admin };

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