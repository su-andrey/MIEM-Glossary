import { createSelector } from "@reduxjs/toolkit";

const getCategories = (state) => state.main.categories

export default getCategories;