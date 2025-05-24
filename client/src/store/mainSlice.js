import { createSlice } from "@reduxjs/toolkit";
import image from "./../assets/jpg/cafe_categories/soup.jpg";
import coffe from "./../assets/categories/coffe.jpg"
import doner from "./../assets/categories/doner.jpg"
import paper from "./../assets/categories/paper.jpg"
import store from "./../assets/categories/store.jpg"

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        users : [],
        posts : [],
        comments : [],
        categories : [
                        {
                            "id": 1,
                            "name": "Кофе",
                            "image": coffe,
                        },
                        {
                            "id": 2,
                            "name": "Фастфуд и шаурма",
                            "image": doner,
                        },
                        {
                            "id": 3,
                            "name": "Копирки",
                            "image": paper,
                        },
                        {
                            "id": 4,
                            "name": "Магазины",
                            "image": store,
                        },
                        {
                            "id": 5,
                            "name": "Преподаватели"
                        },
                        {
                            "id": 6,
                            "name": "Вопросы"
                        },
                        {
                            "id": 7,
                            "name": "Отзывы"
                        }
                    ],
        wasChanged : true,
        email : "",
        userID : null,
    },
    reducers:{
        setEmail(state, action){
            state.email = action.payload
        },

        setUserID(state, action){
            state.userID = action.payload
        },

        setChanged(state, action){
            state.wasChanged = action.payload
        },

        setUsers(state, action){
            state.users = action.payload.data
        },

        setPosts(state, action){
            state.posts = action.payload.data
        },

        setComments(state, action){
            state.comments = action.payload.data
        },

        addComment(state, action){
            state.comments = [action.payload, ...state.comments]
        },

        addPost(state, action){
            state.posts = [action.payload, ...state.posts]
        },


    }
}
)

export const { setUsers, setPosts, setSelfUser, setComments, resetState, setChanged, setEmail, addComment, addPost, setUserID} = mainSlice.actions;
export const mainReducer = mainSlice.reducer;