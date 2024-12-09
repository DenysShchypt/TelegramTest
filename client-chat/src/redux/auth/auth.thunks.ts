import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../common/axios';
import {
  IFormData,
  IFormDataRegister,
  IPublicUser,
} from '../../common/types/auth';
import { IError } from '../../common/types/errors';
import axios from 'axios';

const setAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const registerUser = createAsyncThunk<
  IPublicUser,
  IFormDataRegister,
  { rejectValue: string }
>('users/register', async (data: IFormDataRegister, { rejectWithValue }) => {
  try {
    const resRegisterUser = await instance.post('users/register', data);
    console.log(resRegisterUser.data.user);
    setAuthHeader(resRegisterUser.data.access_token);
    return resRegisterUser.data.user;
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
export const loginUser = createAsyncThunk<
  IPublicUser,
  IFormData,
  { rejectValue: string }
>('users/login', async (data: IFormData, { rejectWithValue }) => {
  try {
    const resRegisterUser = await instance.post('users/login', data);
    setAuthHeader(resRegisterUser.data.access_token);
    return resRegisterUser.data.user;
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
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'users/logout',
  async (_, { rejectWithValue }) => {
    try {
      await instance.post('users/logout');
      clearAuthHeader();
    } catch (error) {
      const typedError = error as IError;
      if (typedError.response?.data?.message) {
        return rejectWithValue(typedError.response.data.message);
      } else if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          'An unknown error occurred during registration.'
        );
      }
    }
  }
);
