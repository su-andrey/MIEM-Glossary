import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const createCategory = async (categoryName, category_id) => {
    if(!categoryName || !category_id){
        throw new Error("Empty category name");
    }
    const data = 
    {
        name : categoryName,
        category_id: category_id,
    } 
    try{
        const response = await axios.post(`${BASE_URL}/categories`, data);
        console.log(response.data);
        return response.data;
    }
    catch(error) {
        console.error("Error creating category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createCategory;