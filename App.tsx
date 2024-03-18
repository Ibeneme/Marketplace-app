import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BuyersStackNavigator from './Routing/Buyers/BuyersStack';
// import { useFonts } from "expo-font";
import {CartContextProvider} from './src/Context/CartContext';
import {Provider} from 'react-redux';
import {store} from './Redux/store';
import CurrencyProvider from './src/Helpers/CurrencyConverter';

const App = () => {
  // const [loaded] = useFonts({
  //   Light: require("./assets/fonts/PlusJakartaSans-Light.ttf"),
  //   Regular: require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
  //   Bold: require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
  //   Medium: require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
  //   SemiBold: require("./assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  // });

  // if (!loaded) {
  //   return null;
  // }

  return (
    <Provider store={store}>
      <CartContextProvider>
        <CurrencyProvider>
          <NavigationContainer>
            <BuyersStackNavigator />
          </NavigationContainer>
        </CurrencyProvider>
      </CartContextProvider>
    </Provider>
  );
};

export default App;
