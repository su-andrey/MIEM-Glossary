import axios from "axios";
import { BASE_URL } from "../../config";

const requireCategory = async (id = "") => {
    try{
        const url = id === "" ? `${BASE_URL}/api/categories` : `${BASE_URL}/api/categories/${id}`;
        const response = await axios.get(url);
        console.log("Categories received: ", response.data);
        return response.data;
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default requireCategory;