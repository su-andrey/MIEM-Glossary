import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const RequireAuth = ({children}) => {
    const location = useLocation();
    const admin = useSelector(state => state.main.isAdmin)
    if(!admin){
        {console.log("Вы не обладаете необходимыми правами для этого действия")}
        <Navigate to="/login" state={{from: location.pathname}}/>
    }
    return children;
}

export default RequireAuth;