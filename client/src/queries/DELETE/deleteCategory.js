import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const deleteCategory = async (id) => {
    if (!id ){
        throw new Error("Missing required category fields");
    }

    try {
        const response = await axios.delete(`${BASE_URL}/categories/${id}`);
        console.log("Category deleted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default deleteCategory;