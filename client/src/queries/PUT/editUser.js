import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const editUser = async (name, author_id, password) => {
    if (!name || !author_id || !password) {
        throw new Error("Missing required user fields");
    }

    const data = { name, password };

    try {
        const response = await axios.put(`${BASE_URL}/users/${author_id}`, data);
        console.log("User edited:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editUser;