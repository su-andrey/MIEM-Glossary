import { useDispatch, useSelector } from "react-redux";
import { setChanged } from "../../store/mainSlice";
import { useEffect } from "react";
import Reply from "../../components/reply/Reply";

const AdminComments = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(setChanged(true))
    }, [])

    const comments = useSelector(state => state.main.comments)
    return( 
        <div>
            {Array.isArray(comments) && comments.map((comment) => (
                <div key={comment.id}>
                    <Reply data={comment} />
                </div>
            ))}
        </div>
    );
}

export default AdminComments;