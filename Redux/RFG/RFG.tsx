import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseApiUrl} from '../BaseUrl/baseApiUrl';
import { RequestData } from '../../src/Buyers/Profile/RfgMulitple';

export const getAllRFG = createAsyncThunk('rfg/getAllRFG', async () => {
  try {
    const token = await AsyncStorage.getItem('marketplace_access_token');

    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(`${baseApiUrl}/rfq`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
});
export const getAllRFGSeller = createAsyncThunk(
  'rfg/getAllRFGSeller',
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

export const getAllRFGMultiple = createAsyncThunk(
  'rfg/getAllRFGMultiple',
  async () => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token');

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get(`${baseApiUrl}/multiple-rfq`, {
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
  'rfg/getAllRFGMultipleSeller',
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

// Define the async thunk to create RFQ
export const createRFQ = createAsyncThunk(
  'rfg/createRFQ',
  async (requestData: any, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token');
      console.log(token, requestData, 'tekna');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.post(
        `${baseApiUrl}/rfq`,
        JSON.stringify(requestData), // Convert requestData to JSON string
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Set content type to JSON
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const submitMultipleRFQResponse = createAsyncThunk(
  'rfg/submitMultipleRFQResponse',
  async (requestData: RequestData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token');
      console.log(requestData, 'requestData');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.post(
        `${baseApiUrl}/multiple-rfq/response`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            //'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error, 'requestDataErr')
      throw error;
    }
  },
);
export const updateMultipleRFQResponse = createAsyncThunk(
  'rfg/updateMultipleRFQResponse',
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
const rfgSlice = createSlice({
  name: 'rfg',
  initialState: {
    rfgData: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllRFG.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRFG.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(getAllRFG.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch RFG data';
      })
      .addCase(createRFQ.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRFQ.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(createRFQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
    builder
      .addCase(getAllRFGMultiple.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRFGMultiple.fulfilled, (state, action) => {
        state.loading = false;
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(getAllRFGMultiple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch RFG data';
      });
    builder
      .addCase(getAllRFGSeller.pending, state => {
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
      });
    builder
      .addCase(getAllRFGMultipleSeller.pending, state => {
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
      });
    builder
      .addCase(submitMultipleRFQResponse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMultipleRFQResponse.fulfilled, (state, action) => {
        state.loading = false;
        // You might need to handle the response data accordingly
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(submitMultipleRFQResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch RFG data';
      });
    builder
      .addCase(updateMultipleRFQResponse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMultipleRFQResponse.fulfilled, (state, action) => {
        state.loading = false;
        // You might need to handle the response data accordingly
        state.rfgData = action.payload;
        state.error = null;
      })
      .addCase(updateMultipleRFQResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch RFG data';
      });
  },
});

// Selectors
export const selectRFG = (state: {rfg: {rfgData: any}}) => state.rfg.rfgData;

// Reducer
export default rfgSlice.reducer;
