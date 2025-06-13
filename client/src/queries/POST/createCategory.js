import axios from "axios";
import { BASE_URL } from "../../config";

const createCategory = async (categoryName) => {
    if(!categoryName){
        throw new Error("Empty category name");
    }
    const data = 
    {
        name : categoryName,
    } 
    try{
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.post(
            `${BASE_URL}/api/categories`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        //console.log("Category created:", response.data);
        return response.data;
    }
    catch(error) {
        console.error("Error creating category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createCategory;