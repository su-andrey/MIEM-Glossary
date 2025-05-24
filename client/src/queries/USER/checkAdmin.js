import getMe from "./getMe";
export default async function checkAdmin() {
    try{
        const token = localStorage.getItem("token")
        if(!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const data = await getMe()
        if(data.is_admin){
            return true;
        }
        throw new Error("Вы не обладаете админскими правами")
    }
    catch(error){
        console.error(error)
        return false;
    }
    

};