import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

const requireCategory = async (id = "") => {
    try{
        if(id === ""){
            throw new Error("Empty category ID");
        }
        else{
            const url = BASE_URL + `/categories/${id}`
            const response = await axios.get(url);
            console.log(response.data);
            return response.data;
        }
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default requireCategory;