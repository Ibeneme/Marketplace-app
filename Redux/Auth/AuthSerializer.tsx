import { createAsyncThunk, miniSerializeError } from "@reduxjs/toolkit";

interface ErrorResponse {
  response?: {
    status?: number;
  };
}

export const createAsyncThunkWithSerializedError = (
  type: string,
  asyncCallback: (args: any, thunkAPI: any) => Promise<any>,
  errorHandling?: (error: ErrorResponse) => any
) => {
  return createAsyncThunk(type, async (args: any, thunkAPI) => {
    try {
      const response = await asyncCallback(args, thunkAPI);
      return response;
    } catch (error: any) {
      const serializedError = miniSerializeError(error) as ErrorResponse;
      //console.log(error.response?.status, serializedError, `${type} Error`);
      if (errorHandling) {
        const handledError = errorHandling(serializedError);
        throw thunkAPI.rejectWithValue(handledError);
      }
      throw thunkAPI.rejectWithValue(error.response?.status);
    }
  });
};
