import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseApiUrl } from "../BaseUrl/baseApiUrl";

// Define the async thunk to create an order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (requestData: any, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      console.log(token, requestData, "tekna");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        `${baseApiUrl}/order`,
        requestData, // Pass requestData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define the async thunk to fetch orders for a buyer
export const fetchOrdersForBuyer = createAsyncThunk(
  "order/fetchOrdersForBuyer",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      console.log(token, "tekna");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${baseApiUrl}/order/buyer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
export const sendBulkOrder = createAsyncThunk(
  "order/sendBulkOrder",
  async (requestData: any, { rejectWithValue }) => {
    try {
      console.log(requestData, 'reduxrequestdata')
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        `${baseApiUrl}/order/bulk-order`,
        requestData, // Pass requestData directly
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define the async thunk to fetch a specific order
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      console.log(token, "tekna");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(
        `${baseApiUrl}/order/${orderId}`, // Use the orderId parameter in the URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create the order slice
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderData: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      })
      .addCase(fetchOrdersForBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersForBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.error = null;
      })
      .addCase(fetchOrdersForBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
    builder
      .addCase(sendBulkOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendBulkOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.error = null;
      })
      .addCase(sendBulkOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
  },
});

// Selectors
export const selectOrder = (state: { order: { orderData: any } }) =>
  state.order.orderData;

export default orderSlice.reducer;
