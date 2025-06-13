import requireComments from "../../queries/GET/requireComments";
import { setComments } from "../mainSlice";
const refreshComments = async (dispatch)=>{
    try{
        const new_comments = await requireComments();
        dispatch(setComments(new_comments))
    }
    catch(error){
        console.error(error)
        return error
    }
}

export default refreshComments;