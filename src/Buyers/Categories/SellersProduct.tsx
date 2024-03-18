import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Product} from '../Products/AllProducts';
import CustomHeader from '../../Helpers/ProductHeaders';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {useCurrency} from '../../Helpers/CurrencyConverter';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {sellersProduct} from '../../../Redux/Product/Product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import LoadingComponent from '../../Components/ShimmerLoader';
const logoImage = require('../../../assets/Tofa.png');
import Icon from 'react-native-remix-icon';

interface Category {
  id: string;
  category: string;
  image?: string;
  products: Product[];
}

interface SellersProductPageProps {}

type SellersProductPageRouteProp = RouteProp<
  StackParamList,
  'SellersProductPage'
>;
type SellersProductPageNavigationProp = StackNavigationProp<
  StackParamList,
  'SellersProductPage'
>;

type SellersProductPagePropsWithNavigation = {
  route: SellersProductPageRouteProp;
  navigation: SellersProductPageNavigationProp;
};

const SellersProductPage: React.FC<SellersProductPagePropsWithNavigation> = ({
  route,
  navigation,
}) => {
  const [productCount, setProductCount] = useState(0);
  const [productData, setProductData] = useState([]);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [userID, setUserID] = useState('');
  const [loading, setLoading] = useState(false);

  const checkToken = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      AsyncStorage.getItem('marketplace_access_token')
        .then(accessToken => {
          if (accessToken !== null) {
            //setAccessTokenExists(true);
            dispatch(fetchCurrentUser())
              .then(response => {
                setUserID(response?.payload?.currentUser);
                const userID = response?.payload?.currentUser;
                console.log('Access Token:', accessToken);
                //console.log('Profile:', response?.payload?.currentUser?.role);

                setLoading(false);
                // resolve();
              })
              .catch(error => {
                // console.error('Error while fetching current user:', error);
                setLoading(false);
                reject(error);
              });
          } else {
            //setAccessTokenExists(false);
            setLoading(false);
            resolve();
          }
        })
        .catch(error => {
          //console.error('Error while checking token:', error);
          setLoading(false);
          reject(error);
        });
    });
  };

  useEffect(() => {
    getSellersProduct();
    console.log('useeftt');
  }, []);

  const getSellersProduct = () => {
    // setLoading(true);
    console.log(userID?.id, 'userID?.id');
    dispatch(sellersProduct(userID?.id))
      .then((response: any) => {
        //setLoading(false);
        console.log(
          'SELLLERRS successfully',
          response.payload,
          //?.data?.pagination?.totalOrders,
        );
        setProductCount(response.payload?.data?.pagination?.totalProducts);
        setProductData(response.payload?.data?.products);
        if (response) {
          // setRfqsCountMultipleSeller(
          //   response.payload?.data?.pagination?.totalOrders,
          // );
          console.log(
            'SELLLERRS successfully',
            response.payload,
            //?.data?.pagination?.totalOrders,
          );
        }
      })
      .catch((error: any) => {
        // Specify the type of error as 'any'
        setLoading(false);
        // Handle errors
      });
  };

  // Fetch product data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getSellersProduct();
      checkToken();
      console.log('loadloadload');
    }, []),
  );

  const handleProductPress = (product: Product) => () => {
    // console.log(product, "kkskskksks");
    navigation.navigate('ProductDetails', {productData: product});
  };
  const {showInUSD} = useCurrency();
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader hideCart title={`Your Products`} />
      {productData?.length === 0 ? (
        <View style={styles.noRFGsContainer}>
          <Icon name="file-list-line" size={50} color="#ccc" />
          <Text style={styles.noRFGsText}>No Products found</Text>
        </View>
      ) : null}
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : (
        <ScrollView contentContainerStyle={styles.containers}>
          {productData?.map(product => (
            <TouchableOpacity
              onPress={handleProductPress(product)}
              key={product.id}
              style={styles.productContainer}>
              <Image
                source={{
                  uri: Array.isArray(product.productImages)
                    ? product.productImages[0].image
                    : product.productImages || 'defaultImageURL',
                }}
                style={styles.productImage}
              />
              <Text style={styles.productTitle}>{product.productName}</Text>
              <Text style={styles.productPrice}>
                {showInUSD
                  ? `NGN ${(
                      parseFloat(product.minPricePerUnit) * 1400
                    ).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `USD ${parseFloat(product.minPricePerUnit).toLocaleString(
                      'en-US',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#Ffffff',
    flex: 1,
  },
  containers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    flexWrap: 'wrap',
  },
  noRFGsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noRFGsText: {
    fontSize: 16,
    marginTop: 16,
  },

  productContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },

  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 4,
    color: '#666666',
  },
});

export default SellersProductPage;
