import { useLocation, Navigate } from "react-router-dom";
import checkAdmin from "../queries/USER/checkAdmin";
import { useEffect, useState } from "react";
import getMe from "../queries/USER/getMe";
import Loader1 from "../components/UI/loader1/Loader1";

const RequireAuth = ({ children }) => {
    const location = useLocation();
    const [admin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const admin = await checkAdmin();
                setIsAdmin(admin);
            } 
            catch (error) {
                console.error("Ошибка при получении admin:", error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, []);

    if(loading){
        return <Loader1 />
    }
    
    if (!admin) {
        //console.log("Вы не обладаете необходимыми правами для этого действия");
        return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default RequireAuth;