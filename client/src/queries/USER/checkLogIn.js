import getMe from "./getMe";
export default async function checkLogIn() {
    try{
        const token = localStorage.getItem("token")
        if(!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const data = await getMe()
        if(data.email){
            return true;
        }
        throw new Error("Токен устарел, попробуйте снова")
    }
    catch(error){
        console.error(error)
        return false;
    }
    
};
