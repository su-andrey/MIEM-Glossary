import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({children}) => {
    const location = useLocation();
    let auth = useSelector(state => state.main.isAuthentificated)
    if(!auth){
        <Navigate to="/login" state={{from: location.pathname}}/>
    }
    return children;
}

export default RequireAuth;