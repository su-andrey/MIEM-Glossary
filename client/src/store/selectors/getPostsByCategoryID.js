import { createSelector } from 'reselect';

const getPostsByCategory = (state, categoryID) => {
    
    return state.main.posts.filter(post => post.category.id == categoryID);
}

export default getPostsByCategory;
