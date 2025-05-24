import { useLocation, Navigate } from "react-router-dom";
import checkLogIn from "../queries/USER/checkLogIn";
import { useState, useEffect } from "react";
import Loader1 from "../components/UI/loader1/Loader1";

const RequireAuth = ({children}) => {
    const location = useLocation();
    const [auth, setAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchLogin = async () => {
            try {
                let result = await checkLogIn()
                setAuth(result)
            } 
            catch (error) {
                console.error("Ошибка при получении прав на вход", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchLogin();
    }, []);
    if (isLoading) {
        return <Loader1 />;
    }
    if(!auth){
        console.log("Проверка аутетификации в HOC провалилась")
        return(
            <Navigate to="/login" state={{ from: location }} replace />
        )
        
    }
    return children;
}

export default RequireAuth;