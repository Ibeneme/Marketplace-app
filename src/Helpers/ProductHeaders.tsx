import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-remix-icon';
import {useCartContext} from '../Context/CartContext';
import {useCurrency} from './CurrencyConverter';

type CustomHeaderProps = {
  title?: string;
  hideCart?: boolean;
  goBackTwice?: boolean;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  goBackTwice,
  hideCart,
}) => {
  const navigation = useNavigation();
  const {cart} = useCartContext();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCartPress = () => {
    navigation.navigate('Cart' as never);
  };
  const {toggleCurrency, showInUSD} = useCurrency();
  return (
    <View style={styles.header}>
      {goBackTwice ? null : (
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-left-s-line" size={24} color="#000" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>

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
            gap: 12,
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
        {!hideCart && (
          <TouchableOpacity onPress={handleCartPress}>
            <Icon name="shopping-cart-line" size={24} color="#000" />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingRight: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontFamily: 'SemiBold',
  },
  cartBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#dc4d04',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default CustomHeader;
