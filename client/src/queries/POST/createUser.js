import axios from "axios";
import { BASE_URL } from "../../config";

const createUser = async (email, password, is_admin) => {
    if (!email || !password) {
        throw new Error("Missing required user fields");
    }
    const data = { email, password, is_admin };
    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        if (typeof is_admin !== "boolean") {
            throw new Error("Поле is_admin должно быть булевым значением");
        }
        const response = await axios.post(
            `${BASE_URL}/api/users`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        //console.log("User created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createUser;