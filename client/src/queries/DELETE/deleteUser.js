import axios from "axios";
import { BASE_URL } from "../../config";

const deleteUser = async (id) => {
    if (!id) {
        throw new Error("Missing required user id");
    }
    try 
    {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.delete(
            `${BASE_URL}/api/users/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(`User with ID ${id} deleted successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || error.message || "Ошибка при удалении пользователя");
    }
};

export default deleteUser;