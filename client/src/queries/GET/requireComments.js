import axios from "axios";
import { BASE_URL } from "../../config";

const requireComments = async (id = "") => {
    try{
        const url = id ? `${BASE_URL}/api/comments` : `${BASE_URL}/api/comments/${id}`;
        const response = await axios.get(url);
        console.log("Comments received: ",response.data);
        return response.data;
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default requireComments;