import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const createCategory = async (categoryName) => {
    if(!categoryName || !category_id){
        throw new Error("Empty category name");
    }
    const data = 
    {
        name : categoryName,
    } 
    try{
        const response = await axios.post(`${BASE_URL}/categories`, data);
        console.log("Category created:", response.data);
        return response.data;
    }
    catch(error) {
        console.error("Error creating category:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createCategory;