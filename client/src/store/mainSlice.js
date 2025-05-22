import { createSlice } from "@reduxjs/toolkit";
import image from "./../assets/jpg/cafe_categories/soup.jpg";

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        users : [],
        posts : [],
        comments : [],
        categories : [
                        {
                            "id": 1,
                            "name": "Кофе"
                        },
                        {
                            "id": 2,
                            "name": "Фастфуд и шаурма"
                        },
                        {
                            "id": 3,
                            "name": "Копирки"
                        },
                        {
                            "id": 4,
                            "name": "Магазины"
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
        isAuthentificated : false,
        email : "",
        password : "",
        userID : null,
        isAdmin : null,
    },
    reducers:{
        setChanged(state, action){
            state.wasChanged = action.payload
        },

        setUsers(state, action){
            state.users = action.payload.data
        },

        setPosts(state, action){
            state.posts = action.payload.data
        },

        setSelfUser(state, action){
            state.isAuthentificated = true;
            state.email = action.payload?.userName
            state.password = action.payload?.password
            state.isAdmin = action.payload?.isAdmin
            state.userID = action.payload?.id
        },

        resetEmail(state, action){
            state.email = action.payload
        },

        resetPassword(state, action){
            state.password = action.payload
        },

        setComments(state, action){
            state.comments = action.payload.data
        },

        handleLogIn(state, action){
            state.isAdmin = action.payload?.isAdmin
            state.isAuthentificated = true
            state.email = action.payload?.email
            state.password = action.payload?.password
            state.userID = action.payload?.userID
        },

        resetState(state){
            state.isAuthentificated = false
            state.email = ""
            state.password = ""
            state.userID = undefined
            state.isAdmin = undefined
            localStorage.removeItem("email")
            localStorage.removeItem("password")
            localStorage.removeItem("token")
        }
    }
}
)

export const { setUsers, setPosts, setSelfUser, setComments, handleLogIn, resetState, setChanged, resetEmail, resetPassword} = mainSlice.actions;
export const mainReducer = mainSlice.reducer;