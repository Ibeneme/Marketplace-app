import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseApiUrl } from "../BaseUrl/baseApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: any[];
  loading: boolean;
  error: {} | null;
}
// interface PayloadType {
//   error: { message: string } | null;
// }

const initialState: AuthState = {
  user: [],
  loading: false,
  error: null,
};

// Define UserData type
interface UserData {
  firstName: string;
  LastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}
interface Email {
  email: string;
}

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: UserData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/register-user`,
        userData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      } else if (error.request) {
        return rejectWithValue({
          message: "No response received from the server.",
        });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (userData: Email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/forgot-password`,
        userData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        return rejectWithValue({ status, data });
      } else if (error.request) {
        return rejectWithValue({
          message: "No response received from the server.",
        });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (userData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/signin-user`,
        userData,
        {
          data: userData,
        }
      );
      const marketplace_access_token = response?.data?.data?.token;
      await AsyncStorage.setItem(
        "marketplace_access_token",
        marketplace_access_token
      );
      const logg = await AsyncStorage.getItem("marketplace_access_token");
      console.log(logg, "Login successful:logs");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      console.log(
        "marketplace_access_token",
        token,
        "marketplace_access_token"
      );
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.get(`${baseApiUrl}/auth/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.get(
        `${baseApiUrl}/auth/users/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/verify-email`,
        verificationData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const verifyPhoneNumber = createAsyncThunk(
  "auth/verifyPhoneNumber",
  async (verificationData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/verify-phonenumber`,
        verificationData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/reset-password/${resetData.token}`,
        resetData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const currentUser = createAsyncThunk("auth/currentUser", async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/auth/current-user`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const resendEmailVerification = createAsyncThunk(
  "auth/resendEmailVerification",
  async (emailData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/resend-email-verification`,
        emailData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const resendPhoneVerification = createAsyncThunk(
  "auth/resendPhoneVerification",
  async (phoneNumberData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/resend-phone-verification`,
        phoneNumberData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const newUserResetPassword = createAsyncThunk(
  "auth/newUserResetPassword",
  async (resetData: any) => {
    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/new-user-resetpassword`,
        resetData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const updateProfileBuyer = createAsyncThunk(
  "auth/updateProfileBuyer",
  async (userData: any, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.patch(
        `${baseApiUrl}/auth/user/update-profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Define update password thunk
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData: any, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }
      const response = await axios.patch(
        `${baseApiUrl}/auth/update-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem("marketplace_access_token");
      // Perform sign-out API call
      const response = await axios.get(`${baseApiUrl}/auth/signout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Define the authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(verifyPhoneNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhoneNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(verifyPhoneNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(currentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });

    builder
      .addCase(resendEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(resendPhoneVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendPhoneVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(resendPhoneVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to register user";
      });
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
    builder
      .addCase(updateProfileBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfileBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });

    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = [];
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? (action.payload as string) : null;
      });
  },
});

export const selectUser = (state: { auth: { user: any } }) => state.auth.user;

export default authSlice.reducer;
