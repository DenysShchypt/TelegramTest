import { createSlice } from '@reduxjs/toolkit';
import { ITelegramData } from '../../common/types/telegram';
import {
  confirmCode,
  disconnectChats,
  getChats,
  getMessages,
  sendCode,
} from './telegram.thunks';

const initialState: ITelegramData = {
  chats: [],
  messages: [],
  isLoading: false,
  isConnect: false,
  isConfirmCode: false,
};

const telegramSlice = createSlice({
  name: 'telegram',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: typeof initialState) => {
      state.isLoading = true;
    };

    const handleRejected = (state: typeof initialState) => {
      state.isLoading = false;
    };
    builder
      .addCase(sendCode.pending, handlePending)
      .addCase(sendCode.fulfilled, (state) => {
        state.isLoading = false;
        state.isConfirmCode = true;
      })
      .addCase(sendCode.rejected, handleRejected)
      .addCase(confirmCode.pending, handlePending)
      .addCase(confirmCode.fulfilled, (state) => {
        state.isLoading = false;
        state.isConnect = true;
      })
      .addCase(confirmCode.rejected, handleRejected)
      .addCase(getChats.pending, handlePending)
      .addCase(getChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(getChats.rejected, handleRejected)
      .addCase(getMessages.pending, handlePending)
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, handleRejected)
      .addCase(disconnectChats.pending, handlePending)
      .addCase(disconnectChats.fulfilled, (state) => {
        state.isLoading = false;
        state.isConnect = false;
        state.isConfirmCode = false;
      })
      .addCase(disconnectChats.rejected, handleRejected);
  },
});

export const telegramSliceReducer = telegramSlice.reducer;
