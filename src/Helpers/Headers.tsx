import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-remix-icon';
import {useNavigation} from '@react-navigation/native';
import {useCurrency} from './CurrencyConverter';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const navigation = useNavigation();
  const {toggleCurrency, showInUSD} = useCurrency();

  const handleLogoClick = () => {
    navigation.navigate('Home' as never);
  };

  const handleSearchClick = () => {
    navigation.navigate('Search' as never);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
      <TouchableOpacity onPress={handleLogoClick}>
        <Image
          source={require('../../assets/Tofa.png')}
          style={{
            height: 24,
            width: 48,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          gap: 24,
          justifyContent: 'space-between',
          alignItems: 'center',
          // borderColor: 'black',
          // borderWidth: 1,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',

            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: 'black',
            borderWidth: 1,
            padding: 5,
            paddingHorizontal: 12,
            borderRadius: 4,
          }}
          onPress={toggleCurrency}>
          <Text onPress={toggleCurrency}>{showInUSD ? 'NAIRA' : 'USD'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearchClick}>
          <Icon name="search-line" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
