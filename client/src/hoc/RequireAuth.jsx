import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({children}) => {
    const location = useLocation();
    const auth = false;
    if(!auth){
        <Navigate to="/login" state={{from: location.pathname}}/>
    }
    return children;
}

export default RequireAuth;