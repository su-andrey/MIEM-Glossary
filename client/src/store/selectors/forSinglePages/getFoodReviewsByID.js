import { createSelector } from "reselect";

const getPosts = state => state.main.posts;
const getCategory = state =>
    state.main.categories.find(category => category.name === "Отзывы");
const getPostID = (_, postID) => postID;

const getFoodReviewsByID = createSelector(
    [getPosts, getPostID, getCategory],
    (posts, postID, reviewCategory)=>{
        //console.log(reviewCategory)
        return posts.filter(post => (post.category?.id == reviewCategory.id && post.category?.name == "Отзывы" && post.name == postID))
    }
);

export default getFoodReviewsByID;