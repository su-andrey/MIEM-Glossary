const getPrepodReviewsByID = (state, prepodID)=>{
    const categories = state.main.categories;
    const reviewCategory = categories.find(category => category.name == "Отзыв")
    return state.main.posts.filter(post => (post.category.id == reviewCategory.id && post.category.name == "Отзыв" && post.name == prepodID))
}

export default getPrepodReviewsByID;
