import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const editUser = async (email, id, password) => {
    if (!email || !id || !password) {
        throw new Error("Missing required user fields");
    }

    const data = { email, password };

    try {
        const response = await axios.put(`${BASE_URL}/users/${id}`, data);
        console.log("User edited:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editUser;