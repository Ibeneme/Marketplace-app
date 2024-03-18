import {configureStore, combineReducers} from '@reduxjs/toolkit';
import productReducer from '../Redux/Product/Product';
import reviewsReducer from './Reviews/Reviews';
import rfgReducer from './RFG/RFG';
import authReducer from './Auth/Auth';
import orderReducer from './Orders/Orders';
import messageReducer from './Messages/Messages';
import sellersOrderReducer from './Orders/Sellers';
import dashboardReducer from './Profile/Profile';
import rfgSellerReducer from './RFG/Sellers';

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  reviews: reviewsReducer,
  rfg: rfgReducer,
  order: orderReducer,
  message: messageReducer,
  sellersOrder: sellersOrderReducer,
  dashboard: dashboardReducer,
  rfgSeller: rfgSellerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
