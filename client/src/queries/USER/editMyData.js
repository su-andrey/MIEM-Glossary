
import editUser from "../PUT/editUser";
import { useSelector } from "react-redux";
const editMyData = async (email, password, id, is_admin) => {
    if (!email || !id || !password) {
        throw new Error("Missing required user fields");
    }
    try {
        const response = await editUser(email, id, password, is_admin)
        console.log("Data edited:", response.data);
        return response.data;
    } 
    catch (error) {
        console.error("Error editing user:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editMyData;