import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {baseApiUrl} from '../BaseUrl/baseApiUrl';
import {RootState} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Product = {
  id: string | number;
  productName: string;
  minPricePerUnit: number;
  maxPricePerUnit: number;
  currency: string;
  noMinOrder?: boolean;
  minOrdersAllowed?: string | null;
  unitForMinOrder?: string;
  supplyCapacity?: string;
  countryOfOrigin?: string;
  unitForSupplyCapacity?: string;
  minDuration?: string;
  maxDuration?: string;
  productSpecification?: {
    color?: string;
  };
  productDescription?: string;
  categoryId?: string;
  productVisibility?: string;
  productStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  barcode?: string | null;
  productImages: {
    image: string;
    id: string;
  }[];
  RFQS?: any[];
  Category?: {
    id: string;
    category: string;
    image: string;
    icon: string;
    slug: string;
    description: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  createdBy?: {
    firstName: string;
    LastName: string;
    role: string;
    country: string;
    id: string;
    phoneNumber: string;
    email: string;
  };
};

interface ProductsState {
  Products: Product[] | null;
  isLoading: boolean;
  error: string | null;
  SingleProduct: Product | null;
}
type Category = {
  image?: string;
  id?: string;
  category: string;
  onPress?: () => void;
};

const initialState: ProductsState = {
  Products: null,
  isLoading: false,
  error: null,
  SingleProduct: null,
};

export const getAllProducts = createAsyncThunk<Product[], {pageNumber: number}>(
  'products/getAllProducts',
  async ({pageNumber}) => {
    try {
      const response = await axios.get(
        `${baseApiUrl}/product?page=${pageNumber}&limit=80`,
      );
      const products: Product[] = response.data?.data?.products || [];
      // ///console.log(JSON.stringify(products, null, 2));
      return products;
    } catch (error) {
      ///console.log(error);
      return Promise.reject(error);
    }
  },
);
export const getParticularProducts = createAsyncThunk<Product, {id: string}>(
  'products/getParticularProducts',
  async ({id}) => {
    try {
      const response = await axios.get(`${baseApiUrl}/product/${id}`);
      const product: Product = response.data?.data;
      return product;
    } catch (error) {
      ///console.log(error);
      return Promise.reject(error);
    }
  },
);

export const getAllCategory = createAsyncThunk(
  'product/getAllCategory',
  async () => {
    try {
      const response = await axios.get(`${baseApiUrl}/category`);
      return response.data;
    } catch (error) {
      ///console.error(error);
      throw error; // Re-throw the error to let the rejection propagate
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

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? (action.payload as string)
          : 'Failed to fetch products';
      });
      builder
      .addCase(deleteProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Products = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? (action.payload as string)
          : 'Failed to fetch products';
      });
    builder
      .addCase(sellersProduct.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellersProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Products = action.payload;
      })
      .addCase(sellersProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? (action.payload as string)
          : 'Failed to fetch products';
      });
    builder
      .addCase(getParticularProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getParticularProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.SingleProduct = action.payload;
      })
      .addCase(getParticularProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? (action.payload as string)
          : 'Failed to fetch products';
      });
    builder
      .addCase(getAllCategory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Products = action.payload;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? (action.payload as string)
          : 'Failed to fetch products';
      });
  },
});

export const selectProducts = (state: RootState) => state.product.Products;
export default productsSlice.reducer;
