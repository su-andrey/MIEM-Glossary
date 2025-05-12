const getPostByCategory = (state, category_id) => {
    return state.posts.filter(post => post.category_id === category_id);
};

export default getPostByCategory
