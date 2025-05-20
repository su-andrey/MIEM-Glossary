import axios from "axios";
import BASE_URL from "../../baseURL";

const editUser = async (email, id, password, is_admin) => {
    if (!email || !id || !password) {
        throw new Error("Missing required user fields");
    }

    const data = { email, password, is_admin: is_admin };

    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.put(
            `${BASE_URL}/api/users/${id}`, 
            data,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("User edited:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editUser;