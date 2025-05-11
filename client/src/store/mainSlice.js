import { createSlice } from "@reduxjs/toolkit";
const mainSlice = createSlice({
    name: 'main',
    initialState: {
        users : [],
        posts : [],
        isAuthentificated : false,
        userName : "",
        userID : "",
        isAdmin : undefined,
    },
    reducers:{
        
    }
}
)

export const { } = mainSlice.actions;
export const mainReducer = mainSlice.reducer;