import { createSelector } from "reselect";

const getPosts = state => state.main.posts;

const getCategory = state =>
    state.main.categories.find(category => category.name === "Отзывы");

const getPrepodID = (_, prepodID) => prepodID;

const getPrepodReviewsByID = createSelector(
    [getPosts, getPrepodID, getCategory],
    (posts, prepodID, category) => {
        if (!category) return [];
        return posts.filter(
            post =>
            post.category?.id === category.id &&
            post.category?.name === "Отзывы" &&
            post.name === prepodID
        );
    }
);

export default getPrepodReviewsByID;
