import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const deleteUser = async (id) => {
    if (!id) {
        throw new Error("Missing required user fields");
    }

    try {
        const response = await axios.delete(`${BASE_URL}/users/${id}`);
        console.log("User deleted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default deleteUser;