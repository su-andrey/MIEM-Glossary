import { createSlice } from "@reduxjs/toolkit";
import posts from "./fake/posts";
import comments from "./fake/comments";
import users from "./fake/users";
import image from "./../assets/jpg/cafe_categories/soup.jpg";
import categories from "./fake/categories";
const mainSlice = createSlice({
    name: 'main',
    initialState: {
        users : users,
        posts : posts,
        comments : comments,
        categories : categories,

        isAuthentificated : false,
        userName : "",
        userID : "",
        isAdmin : undefined,
    },
    reducers:{
        setUsers(state, action){
            state.users = action.payload.data
        },

        setPosts(state, action){
            state.posts = action.payload.data
        },

        setSelfUser(state, action){
            state.isAuthentificated = true;
            state.userName = action.payload.userName
            state.userID = action.payload.authorID
            state.isAdmin = action.payload.isAdmin
        },

        setComments(state, action){
            state.comments = action.payload.data
        },
    }
}
)

export const { setUsers, setPosts, setSelfUser, setComments, } = mainSlice.actions;
export const mainReducer = mainSlice.reducer;