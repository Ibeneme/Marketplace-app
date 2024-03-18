// sellProductSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {Product} from './Product';
import {baseApiUrl} from '../BaseUrl/baseApiUrl';

interface SellProductState {
  status: 'idle' | 'loading';
  error: string | null;
}

const initialState: SellProductState = {
  status: 'idle',
  error: null,
};

export const sellProduct = createAsyncThunk(
  'products/sellProduct',
  async (formData: FormData, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token');

      const response = await axios.post(`${baseApiUrl}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = JSON.stringify(error.response.data);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const sellersProduct = createAsyncThunk(
  'products/sellersProduct',
  async (user_id: string, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token');

      const response = await axios.get(
        `${baseApiUrl}/product/seller/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = JSON.stringify(error.response.data);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const addImage = createAsyncThunk(
  'products/sellProduct',
  async (productData: Product, productID: string, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token'); // Get token from AsyncStorage
      const response = await axios.post(
        `${baseApiUrl}/product/image/${productID}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token'); // Get token from AsyncStorage
      const response = await axios.delete(
        `${baseApiUrl}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateProductTitle = createAsyncThunk(
  'products/updateProductTitle',
  async (
    {productId, newTitle}: {productId: string; newTitle: string},
    thunkAPI,
  ) => {
    try {
      const token = await AsyncStorage.getItem('marketplace_access_token'); // Get token from AsyncStorage
      const response = await axios.patch(
        `http://localhost:8081/api/v2/product/${productId}`,
        {productName: newTitle},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const sellProductSlice = createSlice({
  name: 'sellProduct',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sellProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(sellProduct.fulfilled, state => {
        state.status = 'idle';
      })
      .addCase(sellProduct.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
      });
    builder
      .addCase(addImage.pending, state => {
        state.status = 'loading';
      })
      .addCase(addImage.fulfilled, state => {
        state.status = 'idle';
      })
      .addCase(addImage.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
      });
    builder
      .addCase(sellersProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(sellersProduct.fulfilled, state => {
        state.status = 'idle';
      })
      .addCase(sellersProduct.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, state => {
        state.status = 'idle';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
      })
      .addCase(updateProductTitle.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateProductTitle.fulfilled, state => {
        state.status = 'idle';
      })
      .addCase(updateProductTitle.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
      });
  },
});

export default sellProductSlice.reducer;
