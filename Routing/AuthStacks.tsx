import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthenticationChoice from "../src/Auth/AuthenticationChoise";
import BuyerSignup from "../src/Auth/BuyerSignup";
import SellerSignup from "../src/Auth/SellerSignup";
import Login from "../src/Auth/Login";
import ForgotPassword from "../src/Auth/ForgotPassword";

type AuthStackParamList = {
  ChooseSignupOption: undefined;
  BuyerSignup: undefined;
  SellerSignup: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPasswordSuccess: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator initialRouteName="ChooseSignupOption">
      <AuthStack.Screen
        name="ChooseSignupOption"
        component={AuthenticationChoice}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="BuyerSignup"
        component={BuyerSignup}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SellerSignup"
        component={SellerSignup}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      {/* <AuthStack.Screen
        name="ResetPasswordSuccess"
        component={ResetPasswordSuccess}
        options={{ headerShown: false }}
      /> */}
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
