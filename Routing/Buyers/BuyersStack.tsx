import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BuyersBottomTabNavigator} from './BuyersBottomTab';
import Search from '../../src/Buyers/Search/Search';
import Categories, {Category} from '../../src/Buyers/Categories/Categories';
import ProductDetails from '../../src/Buyers/Products/ProductDetails';
import ProductPage from '../../src/Buyers/Categories/Products';
import Orders, {Order} from '../../src/Buyers/Profile/Orders';
import Messages from '../../src/Buyers/Profile/Messages';
import Rfg from '../../src/Buyers/Profile/Rfg';
import OrderDetails from '../../src/Buyers/Profile/OrderDetails';
import Settings from '../../src/Buyers/Profile/Settings';
import AuthenticationChoice from '../../src/Auth/AuthenticationChoise';
import BuyerSignup from '../../src/Auth/BuyerSignup';
import SellerSignup from '../../src/Auth/SellerSignup';
import Login from '../../src/Auth/Login';
import ForgotPassword from '../../src/Auth/ForgotPassword';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Product} from '../../src/Buyers/Products/AllProducts';
import VerifyOTP from '../../src/Auth/Verify';
import SuccessAuth from '../../src/Auth/SuccessAuth';
import QuoteForm from '../../src/Buyers/Products/ProductHelpers/Quotes';
import RequestSuccess from '../../src/Buyers/Products/ProductHelpers/RequestSuccess';
import CartSuccess from '../../src/Buyers/Cart/CartSuccess';
import SellersDetails from '../../src/Buyers/Products/ProductHelpers/SellersProfilePage';
import {SellersData} from './Types';
import ProfileDetails from '../../src/Buyers/Profile/ViewProfile';
import {User} from '../../src/Buyers/Profile/Profile';
import ForgotAuth from '../../src/Auth/ForgotSuccess';
import Messaging, {Message} from '../../src/Buyers/Messages/Messages';
import RfgMuiltple from '../../src/Buyers/Profile/RfgMulitple';
import RfgMultiple from '../../src/Buyers/Profile/RfgMulitple';
import MessageComponent from '../../src/Buyers/Messages/Messages';
import MessageComponents from '../../src/Buyers/Messages/SendMessage';
import AllMessageComponent from '../../src/Buyers/Messages/AllMessages';
import SellProductForm from '../../src/Sellers/Product/Sell';
import SellProductFormNext from '../../src/Sellers/Product/SellNextPage';
import ProductSpecification from '../../src/Sellers/Product/RealSell';
import ImageUpload from '../../src/Sellers/Product/ImageUpload';
import SellersProductPage from '../../src/Buyers/Categories/SellersProduct';
import SubCategories from '../../src/Buyers/Categories/SubCategory';
import SubSubCategories from '../../src/Buyers/Categories/SubSubCategory';
import SubSubSubCategories from '../../src/Buyers/Categories/SubSubSubCat';
// import PaymentScreen from '../../src/Buyers/Cart/Pay';

type OrderHistory = {
  status: string;
  date: string;
};

export type StackParamList = {
  Dashboard: undefined;
  Search: undefined;
  ProductDetails: {productData: Product};
  Categories: undefined;
  ProductPage: {categoryData: Category};
  Orders: undefined;
  Messages: undefined;
  RFG: undefined;
  RfgMultiple: undefined;
  OrderDetails: {order: Order};
  Settings: undefined;
  ChooseSignupOption: undefined;
  BuyerSignup: undefined;
  SellerSignup: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPasswordSuccess: undefined;
  Verify: undefined;
  SuccessAuth: undefined;
  ForgotAuth: undefined;
  QuoteForm: {productData: Product};
  CartSuccess: {currency: string; amount: number};
  RequestSuccess: {productData: Product};
  SellersDetails: {sellersData: SellersData};
  ProfileDetails: {profile: User};
  Messaging: {sellersData: Message};
  AllMessageComponent: {profile: User};
  SellProductForm: undefined;
  SellProductFormNext: {Values: any};
  ProductSpecification: undefined;
  ImageUpload: undefined;
  SellersProductPage: undefined;
  SubCategories: undefined;
  SubSubCategories: undefined;
  SubSubSubCategories: undefined;
};

type BuyersStackNavigationProp<T extends keyof StackParamList> =
  StackNavigationProp<StackParamList, T>;
type BuyersRouteProp<T extends keyof StackParamList> = RouteProp<
  StackParamList,
  T
>;

type BuyersProps<T extends keyof StackParamList> = {
  navigation: BuyersStackNavigationProp<T>;
  route: BuyersRouteProp<T>;
};

const Stack = createStackNavigator<StackParamList>();

const BuyersStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={BuyersBottomTabNavigator}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{headerTitle: 'Categories'}}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductPage"
        component={ProductPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{headerShown: false}}
      />

      <Stack.Screen name="RFG" component={Rfg} options={{headerShown: false}} />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChooseSignupOption"
        component={AuthenticationChoice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BuyerSignup"
        component={BuyerSignup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SellerSignup"
        component={SellerSignup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Verify"
        component={VerifyOTP}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SuccessAuth"
        component={SuccessAuth}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="QuoteForm"
        component={QuoteForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RequestSuccess"
        component={RequestSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotAuth"
        component={ForgotAuth}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CartSuccess"
        component={CartSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SellersDetails"
        component={SellersDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Messaging"
        component={Messaging}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RfgMultiple"
        component={RfgMultiple}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllMessageComponent"
        component={AllMessageComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SellProductForm"
        component={SellProductForm}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SellProductFormNext"
        component={SellProductFormNext}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ProductSpecification"
        component={ProductSpecification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ImageUpload"
        component={ImageUpload}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SellersProductPage"
        component={SellersProductPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SubCategories"
        component={SubCategories}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SubSubCategories"
        component={SubSubCategories}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name="SubSubSubCategories"
        component={SubSubSubCategories}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default BuyersStackNavigator;
