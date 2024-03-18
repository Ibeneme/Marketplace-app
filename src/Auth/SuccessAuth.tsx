import {StyleSheet, Text, TouchableOpacity, Image, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useLayoutEffect} from 'react';

const logoImage = require('../../assets/fonts/sentEmail.png');

export default function SuccessAuth() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitleStyle: {
        fontFamily: 'Regular',
      },
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <View
      style={[
        styles.containerfirst,
        {
          backgroundColor: '#ffff',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.text}>Account Created Successful</Text>
        <Text style={[styles.textsmall]}>
          Pls verify your account, open your mail and click on the link sent to
          you{' '}
        </Text>
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard' as never)}
          style={styles.buttonClick}>
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerfirst: {
    height: '100%',
    padding: 16,
  },
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 94,
  },
  text: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'SemiBold',
    marginTop: '5%',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  textsmall: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: '02%',
    fontFamily: 'Regular',
    lineHeight: 24,
    color: '#808080',
  },
  containerButton: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
  },
  buttonClick: {
    backgroundColor: '#dc4d04',
    width: '100%',
    height: 55,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Regular',
    fontSize: 16,
  },
});
