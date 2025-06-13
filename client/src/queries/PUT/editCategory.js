import axios from "axios";
import { BASE_URL } from "../../config";

const editCategory = async (category_name, category_id) => {
    if (!category_name || !category_id ){
        throw new Error("Missing required category fields");
    }

    const data = { name:category_name };

    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.put(
            `${BASE_URL}/api/categories/${category_id}`,
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        //console.log("Category edited:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editCategory;