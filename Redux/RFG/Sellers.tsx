import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseApiUrl } from '../BaseUrl/baseApiUrl';
import { RFGS } from '../../src/Buyers/Profile/Rfg';

interface RfgState {
    rfgData: RFGS[] | null; // Update to reflect the correct type
    loading: boolean;
    error: string | null;
  }
  

const initialState: RfgState = {
    rfgData: null,
    loading: false,
    error: null,
  };
  
// Define the thunk payload types
interface ThunkPayload {
  requestId?: string;
  requestData?: any;
}

// Define the thunk return type
type ThunkReturnType = Promise<any>; // Update the type according to your API response data structure

// Thunk for getting all RFG for seller
export const getAllRFGSeller = createAsyncThunk(
    'rfgSeller/getAllRFGSeller',
    async () => {
      try {
        const token = await AsyncStorage.getItem('marketplace_access_token');
  
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await axios.get(`${baseApiUrl}/rfq/seller`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  );

  export const getAllRFGMultipleSeller = createAsyncThunk(
    'rfgSeller/getAllRFGMultipleSeller',
    async () => {
      try {
        const token = await AsyncStorage.getItem('marketplace_access_token');
  
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await axios.get(`${baseApiUrl}/multiple-rfq/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  );
  

export const submitMultipleRFQResponse = createAsyncThunk(
    'rfgSeller/submitMultipleRFQResponse',
    async (requestData, {rejectWithValue}) => {
      try {
        const token = await AsyncStorage.getItem('marketplace_access_token');
  
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await axios.post(
          `${baseApiUrl}/multiple-rfq/response`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
  
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  );
  export const updateMultipleRFQResponse = createAsyncThunk(
    'rfgSeller/updateMultipleRFQResponse',
    async (
      {requestId, requestData}: {requestId: string; requestData: any},
      {rejectWithValue},
    ) => {
      try {
        const token = await AsyncStorage.getItem('marketplace_access_token');
  
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await axios.put(
          `${baseApiUrl}/multiple-rfq/response/${requestId}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
  
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  );
  
// Create the RFG slice
const rfgSellerSlice = createSlice({
  name: 'rfgSeller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRFGSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRFGSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(getAllRFGSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch RFG data';
      })
      .addCase(getAllRFGMultipleSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRFGMultipleSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(getAllRFGMultipleSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch RFG data';
      })
      .addCase(submitMultipleRFQResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMultipleRFQResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(submitMultipleRFQResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      })
      .addCase(updateMultipleRFQResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMultipleRFQResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(updateMultipleRFQResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
  },
});

export const selectRFG = (state: { rfg: RfgState }) => state.rfg.rfgData;

export default rfgSellerSlice.reducer;
