import axios from "axios";
import { BASE_URL } from "../../config";


const deleteCategory = async (id) => {
    if(!id){
        throw new Error("Missing required category fields");
    }
    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.delete(
            `${BASE_URL}/api/categories/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        //console.log("Category deleted:", response.data);
        return response.data;
    } 
    catch (error) {
        console.error("Error deleting category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default deleteCategory;