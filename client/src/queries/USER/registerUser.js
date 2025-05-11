import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const registerUser = async (mail, password) => {
    if (!mail || !password){
        throw new Error("Missing required user fields");
    }
    
};

export default registerUser;