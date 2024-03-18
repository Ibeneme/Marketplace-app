import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseApiUrl} from '../BaseUrl/baseApiUrl';

interface DashboardState {
  dashboardData: any; // Update the type according to your API response data structure
  loading: boolean;
  error: string | null;
}

// Define the thunk payload type
interface ThunkPayload {
  userId: string;
}

// Define the thunk return type
type ThunkReturnType = Promise<any>; // Update the type according to your API response data structure

export const getDashboardData = createAsyncThunk<
  ThunkReturnType,
  ThunkPayload,
  {
    rejectValue: string;
  }
>('dashboard/getDashboardData', async ({userId}, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('marketplace_access_token');

    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(
      `${baseApiUrl}/dashboard/seller/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    throw rejectWithValue(error.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardData: null,
    loading: false,
    error: null,
  } as DashboardState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDashboardData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch dashboard data';
      });
  },
});

export const selectDashboardData = (state: {dashboard: DashboardState}) =>
  state.dashboard.dashboardData;

export default dashboardSlice.reducer;
