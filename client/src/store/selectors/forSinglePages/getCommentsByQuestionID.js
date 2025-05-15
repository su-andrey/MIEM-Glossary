import { createSelector } from 'reselect';


const getCommentsByQuestionID = (state, questionID)=>{
    const comments = state.main.comments.filter(comment => comment.post.id == questionID)
    return comments;
}


export default getCommentsByQuestionID;