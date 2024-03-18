import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AllProducts from '../../src/Buyers/Products/AllProducts';
import Cart from '../../src/Buyers/Cart/Cart';
import Profile from '../../src/Buyers/Profile/Profile';

const Tab = createBottomTabNavigator();

const BottomNavigation: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={AllProducts} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
