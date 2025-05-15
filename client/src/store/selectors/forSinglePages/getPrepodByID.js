import { createSelector } from 'reselect';

const getPrepodByID = (state, prepodID)=>{
    const prepod = state.main.posts.find(post => (post.id == prepodID && post.category.name=="Препод"))
    return prepod;
}

export default getPrepodByID;