import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

const requireUsers = async (id = "") => {
    try{
        const url = id === "" ? `${BASE_URL}/users` : `${BASE_URL}/users/${id}`;
        const response = await axios.get(url);
        console.log(response.data);
        return response.data;
    } 
    catch(error){
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default requireUsers;