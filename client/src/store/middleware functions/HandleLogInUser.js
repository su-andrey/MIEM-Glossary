import logInUser from "../../queries/USER/logInUser";
import { handleLogIn } from "../mainSlice";

export const HandleLoginUser = (email, password) => async (dispatch) => {
    try {
        const response = await logInUser(email, password); // API-запрос
        dispatch(handleLogIn({
            email: response.email,
            password: password,
        }));
    } 
    catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};