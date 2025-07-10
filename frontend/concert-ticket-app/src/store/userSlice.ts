import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
}

const initialState: UserState = {
  token: localStorage.getItem("token"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, logout } = userSlice.actions;
export default userSlice.reducer;
