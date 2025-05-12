import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({children}) => {
    const location = useLocation();
    const admin = false;
    if(!admin){
        <Navigate to="/login" state={{from: location.pathname}}/>
    }
    return children;
}

export default RequireAuth;