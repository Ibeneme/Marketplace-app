import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AxiosInstance = axios.create();

AxiosInstance.interceptors.request.use(
  async (config) => {
    const marketplase_access_token = await AsyncStorage.getItem("marketplase_access_token");
    if (marketplase_access_token) {
      config.headers.Authorization = `Bearer ${marketplase_access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const handleUnauthorizedError = () => {
  AsyncStorage.removeItem("marketplase_access_token");
};

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      handleUnauthorizedError();
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
