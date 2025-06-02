import axios from "axios";
import { BASE_URL } from "../../config";

const searchSubstring = async (search) => {
    try{
        const url = `${BASE_URL}/api/posts/search?str=${encodeURIComponent(search)}`;
        const response = await axios.get(
            url
        );
        console.log("Results of the search: ",response.data);
        return response.data;
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default searchSubstring;