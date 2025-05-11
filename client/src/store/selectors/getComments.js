const getComments = (state, postID) => {
    return state.comments.filter((comment)=>comment.post_id === postID);
};

export default getComments