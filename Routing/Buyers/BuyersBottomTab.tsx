import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-remix-icon";
import AllProducts from "../../src/Buyers/Products/AllProducts";
import Search from "../../src/Buyers/Search/Search";
import Cart from "../../src/Buyers/Cart/Cart";
import Profile from "../../src/Buyers/Profile/Profile";
import { RouteProp } from "@react-navigation/native";
import Categories from "../../src/Buyers/Categories/Categories";
import Header from "../../src/Helpers/Headers";
import { SafeAreaView, View, Text } from "react-native";
import { useCartContext } from "../../src/Context/CartContext";
import SellProductForm from "../../src/Sellers/Product/Sell";

type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
  SellProductForm: undefined
};

const Tab = createBottomTabNavigator<TabParamList>();

type BuyersBottomTabNavigationProp = RouteProp<
  TabParamList,
  keyof TabParamList
>;

const BuyersBottomTabNavigator = () => {
  const activeColor = "#dc4d04";
  const { cart } = useCartContext();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tab.Screen
        name="Home"
        component={AllProducts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-line" size={size} color={color} />
          ),
          title: "",
          header: () => (
            <SafeAreaView style={{ backgroundColor: "white" }}>
              <Header />
            </SafeAreaView>
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard-line" size={size} color={color} />
          ),
          title: "",
          header: () => (
            <SafeAreaView style={{ backgroundColor: "white" }}>
              <Header />
            </SafeAreaView>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ color, size }) => (
            <>
              <Icon name="shopping-cart-line" size={size} color={color} />
              {cart.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 25,
                    backgroundColor: "#dc4d04",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {cart.length}
                  </Text>
                </View>
              )}
            </>
          ),
          title: "",
          header: () => (
            <SafeAreaView style={{ backgroundColor: "white" }}>
              <Header />
            </SafeAreaView>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-line" size={size} color={color} />
          ),
          title: "",
          header: () => (
            <SafeAreaView style={{ backgroundColor: "white" }}>
              <Header />
            </SafeAreaView>
          ),
        }}
      />
      
        {/* <Tab.Screen
        name="SellProductForm"
        component={SellProductForm}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-line" size={size} color={color} />
          ),
          title: "",
          header: () => (
            <SafeAreaView style={{ backgroundColor: "white" }}>
              <Header />
            </SafeAreaView>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export { BuyersBottomTabNavigator };