import registerUser from "../../queries/USER/registerUser";

const handleRegisterUser = async (email, password) => {
    try {
        const response = await registerUser(email, password);
        console.log(response)
        return response;
    } 
    catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export default handleRegisterUser;