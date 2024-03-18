import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseApiUrl } from "../BaseUrl/baseApiUrl";



export const fetchsellersOrders = createAsyncThunk(
  "sellersOrder/fetchsellersOrders",
  async () => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      console.log(token, "tekna");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${baseApiUrl}/order/seller`, {
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



// Define the async thunk to fetch a specific sellersOrder
export const fetchsellersOrderById = createAsyncThunk(
  "sellersOrder/fetchsellersOrderById",
  async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      console.log(token, "tekna");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(
        `${baseApiUrl}/order/${orderId}`, // Use the sellersOrderId parameter in the URL
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

// Create the sellersOrder slice
const sellersOrderSlice = createSlice({
  name: "sellersOrder",
  initialState: {
    sellersOrderData: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchsellersOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsellersOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sellersOrderData = action.payload;
        state.error = null;
      })
      .addCase(fetchsellersOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      })
      .addCase(fetchsellersOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsellersOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.sellersOrderData = action.payload;
        state.error = null;
      })
      .addCase(fetchsellersOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
  
  },
});

// Selectors
export const selectsellersOrder = (state: { sellersOrder: { sellersOrderData: any } }) =>
  state.sellersOrder.sellersOrderData;

export default sellersOrderSlice.reducer;
