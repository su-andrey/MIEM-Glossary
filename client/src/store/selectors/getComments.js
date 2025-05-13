import { createSelector } from "@reduxjs/toolkit";

const getComments = createSelector(
    [(state) => state.main.comments],
    (comments) => comments
);

export default getComments;