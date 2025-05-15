import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const editCategory = async (category_name, category_id) => {
    if (!category_name || !category_id ){
        throw new Error("Missing required category fields");
    }

    const data = { category_name };

    try {
        const response = await axios.put(`${BASE_URL}/categories/${category_id}`, data);
        console.log("Category edited:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editCategory;