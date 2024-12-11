import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../common/axios';
import { IError } from '../../common/types/errors';
import {
  IChat,
  IConfirmCode,
  IConnect,
  IMessage,
} from '../../common/types/telegram';

export const sendCode = createAsyncThunk<
  { message: string },
  IConnect,
  { rejectValue: string }
>('telegram/send-code', async (data: IConnect, { rejectWithValue }) => {
  try {
    const res = await instance.post('telegram/send-code', data);
    return res.data.message;
  } catch (error) {
    const typedError = error as IError;
    if (typedError.response?.data?.message) {
      return rejectWithValue(typedError.response.data.message);
    } else if (typedError.message) {
      return rejectWithValue(typedError.message);
    } else {
      return rejectWithValue('An unknown error occurred during registration.');
    }
  }
});

export const confirmCode = createAsyncThunk<
  { message: string },
  IConfirmCode,
  { rejectValue: string }
>('telegram/confirm-code', async (data: IConfirmCode, { rejectWithValue }) => {
  try {
    const res = await instance.post('telegram/confirm-code', data);
    localStorage.setItem('telegram', 'success');
    return res.data.message;
  } catch (error) {
    const typedError = error as IError;
    if (typedError.response?.data?.message) {
      return rejectWithValue(typedError.response.data.message);
    } else if (typedError.message) {
      return rejectWithValue(typedError.message);
    } else {
      return rejectWithValue('An unknown error occurred during registration.');
    }
  }
});

export const getChats = createAsyncThunk<
  IChat[],
  void,
  { rejectValue: string }
>('telegram/chats', async (_, { rejectWithValue }) => {
  try {
    const res = await instance.get('telegram/chats');
    return res.data.chats;
  } catch (error) {
    const typedError = error as IError;
    if (typedError.response?.data?.message) {
      return rejectWithValue(typedError.response.data.message);
    } else if (typedError.message) {
      return rejectWithValue(typedError.message);
    } else {
      return rejectWithValue('An unknown error occurred during registration.');
    }
  }
});

export const getMessages = createAsyncThunk<
  IMessage[],
  number,
  { rejectValue: string }
>('telegram/messages', async (id: number, { rejectWithValue }) => {
  try {
    const res = await instance.get(`/telegram/chats/${id}/messages`);
    return res.data.messages;
  } catch (error) {
    const typedError = error as IError;
    if (typedError.response?.data?.message) {
      return rejectWithValue(typedError.response.data.message);
    } else if (typedError.message) {
      return rejectWithValue(typedError.message);
    } else {
      return rejectWithValue('An unknown error occurred during registration.');
    }
  }
});

export const disconnectChats = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('telegram/logout-telegram', async (_, { rejectWithValue }) => {
  try {
    await instance.post(`telegram/logout-telegram`);
    localStorage.setItem('telegram', '');
    return;
  } catch (error) {
    const typedError = error as IError;
    if (typedError.response?.data?.message) {
      return rejectWithValue(typedError.response.data.message);
    } else if (typedError.message) {
      return rejectWithValue(typedError.message);
    } else {
      return rejectWithValue('An unknown error occurred during registration.');
    }
  }
});
