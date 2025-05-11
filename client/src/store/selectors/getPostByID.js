const getPostById = (state, postId) => {
    return state.posts.find(post => post.post_id === postId);
};

export default getPostById