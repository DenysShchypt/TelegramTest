import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from '../../common/types/auth';
import { loginUser, logout, registerUser } from './auth.thunks';

const initialState: IAuthState = {
  user: {
    email: '',
    username: '',
    _id: '',
  },
  isLoading: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const authSliceReducer = authSlice.reducer;
