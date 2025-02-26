import { createSlice } from "@reduxjs/toolkit";

const storedUserData = JSON.parse(localStorage.getItem("userData")) || null;
const initialState = {
  status: !!storedUserData,
  userData: storedUserData,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true,
        state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null
      localStorage.removeItem("userData");
    }


  }

})


export const { login, logout } = authSlice.actions;


export default authSlice.reducer;