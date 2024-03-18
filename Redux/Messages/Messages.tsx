import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseApiUrl } from "../BaseUrl/baseApiUrl";
import { Message } from "../../src/Buyers/Messages/Messages";

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ to, message }: { to: string; message: string }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        `${baseApiUrl}/message/send-message`,
        {
          to,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data, "fff");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchMessageById = createAsyncThunk(
  "messages/fetchMessageById",
  async (messageId: string) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${baseApiUrl}/message/${messageId}`, {
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

export const fetchUserMessages = createAsyncThunk(
  "messages/fetchUserMessages",
  async () => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(
        `${baseApiUrl}/message/receiver/user-messages`,
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

export const getAllMessages = createAsyncThunk(
  "messages/getAllMessages",
  async () => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.get(`${baseApiUrl}/message/all-messages`, {
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

export const sendMessageResponse = createAsyncThunk(
  "messages/sendMessageResponse",
  async ({
    from,
    messageID,
    message,
  }: {
    from: string;
    messageID: string;
    message: string;
  }) => {
    try {
      const token = await AsyncStorage.getItem("marketplace_access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(
        `${baseApiUrl}/message/send-message-response`,
        {
          from,
          messageID,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// Create the messages slice
const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    sending: false,
    fetching: false,
    error: null as string | null,
    message: null as Message | null, // Define your Message type here
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For sending a message
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sending = false;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.error.message || "Failed to send message";
      })
      // For fetching a message by ID
      .addCase(fetchMessageById.pending, (state) => {
        state.fetching = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.fetching = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.error.message || "Failed to fetch message";
        state.message = null;
      })
      // For sending a message response
      .addCase(sendMessageResponse.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessageResponse.fulfilled, (state) => {
        state.sending = false;
        state.error = null;
      })
      .addCase(sendMessageResponse.rejected, (state, action) => {
        state.sending = false;
        state.error = action.error.message || "Failed to send message response";
      });
    builder
      // For fetching user messages
      .addCase(fetchUserMessages.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.fetching = false;
        state.message = action.payload; // Assuming your state has a field called messages to store the fetched user messages
        state.error = null;
      })
      .addCase(fetchUserMessages.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.error.message || "Failed to fetch user messages";
        state.message = null; // Reset messages on rejection
      });
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.fetching = false;
        state.message = action.payload; // Assuming your state has a field called messages to store the fetched user messages
        state.error = null;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.error.message || "Failed to fetch user messages";
        state.message = null; // Reset messages on rejection
      });
  },
});
export default messagesSlice.reducer;