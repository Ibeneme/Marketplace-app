import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseApiUrl } from "../BaseUrl/baseApiUrl";



export const getAllReviews = createAsyncThunk(
    "reviews/getAllReviews",
    async (product_id: string) => {
      try {
        const response = await axios.get(`${baseApiUrl}/reviews/get-product-reviews/${product_id}`);
        return response.data;
      } catch (error) {
        //console.error(error);
        throw error;
      }
    }
  );

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null as string | null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error to null on pending
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = null; // Reset error to null on success
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      });
  },
});

export const selectReviews = (state: { reviews: { reviews: any[] } }) => state.reviews.reviews;

export default reviewsSlice.reducer;
