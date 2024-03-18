import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Modal,
} from 'react-native';
import CustomHeader from '../../Helpers/ProductHeaders';
import ReviewsProfileComponent from './ProductHelpers/Reviews';
import ProductActions from './ProductHelpers/SellersProfile';
import QuoteForm from './ProductHelpers/Quotes';
import {useCartContext} from '../../Context/CartContext';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import Product, {
//   getParticularProducts,
//   selectProducts,
// } from "../../../Redux/Product/Product";
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {Product} from './AllProducts';
import {getAllReviews} from '../../../Redux/Reviews/Reviews';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import LoadingComponent from '../../Components/ShimmerLoader';
import {fetchCurrentUser, getUserById} from '../../../Redux/Auth/Auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {useCurrency} from '../../Helpers/CurrencyConverter';
import {User} from '../Profile/Profile';
import SellersProductActions from './ProductHelpers/SellersOptions';
import {deleteProduct} from '../../../Redux/Product/Product';

const ProductDetails: React.FC = () => {
  const route = useRoute();
  const {productData} = route.params as {productData: Product};
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sellerData, setSellersData] = useState('');
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  const [inCart, setInCart] = useState(false);
  const {cart, addToCart} = useCartContext();
  const product = productData;

  console.log(product, 'product');
  const handleGetSeller = async () => {
    if (productData && productData.createdBy) {
      dispatch(getUserById(productData.createdBy.id))
        .then((response: any) => {
          // Handle successful response
          console.log('User data:', response?.payload?.data);
          setSellersData(response?.payload?.data);
        })
        .catch((error: any) => {
          // Handle error
          console.error('Error fetching user data:', error);
        });
    } else {
      console.error('productData or createdBy is undefined');
    }
  };

  useEffect(() => {
    const isInCart = cart.some(item => item.id === product.id);
    setInCart(isInCart);
    handleGetSeller();
  }, [cart, product.id]);

  console.log('Adding to Cart:', productData);
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      quantity: 1,
      images: product.productImages[0]?.image,
      price: product.minPricePerUnit,
      description: product.productDescription, // Add a placeholder description or retrieve it from the product object if available
      currency: product.currency,
      seller: product.createdBy?.id || '',
      text: product.productName,
      countryOfOrigin: product?.createdBy?.country || ' ',
      logisticsStatus: product.status || '',
    });

    setInCart(true);
  };

  const logoImage = require('../../../assets/Tofa.png');
  if (!productData) {
    return (
      <View>
        <LoadingComponent logo={logoImage} />
      </View>
    );
  }

  //console.log(productData, "productData");

  const productDetails = [
    {label: 'Country Of Origin', value: `${productData?.countryOfOrigin}`},
    {label: 'Product Visibility', value: `${productData?.productVisibility}`},
    {
      label: 'Unit For Supply Capacity',
      value: `${productData?.unitForSupplyCapacity}`,
    },
    {
      label: 'Delivery Duration',
      value: `${product?.minDuration} - ${product?.maxDuration}`,
    },
  ];

  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const handleRequestQuote = async () => {
    try {
      const accessToken = await AsyncStorage.getItem(
        'marketplace_access_token',
      );
      console.log('Access Token:', accessToken);
      if (accessToken) {
        (navigation.navigate as any)('QuoteForm', {productData: product});
      } else {
        navigation.navigate('Login' as never);
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to handle opening and closing the modal
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDeleteProduct = () => {
    // Close the modal after deletion
    dispatch(deleteProduct(product.id))
      .then(response => {
        console.log('Product deleted successfully:', response);
        if (response?.payload?.message === 'success') {
          navigation.goBack();
          // toggleModal();
        }
      })
      .catch(error => {
        // Handle error
        console.error('Error deleting product:', error);
        // Display an error message to the user or perform any other actions
      });
  };

  const handleViewCart = () => {
    navigation.navigate('Cart' as never);
  };
  const handleViewSeller = () => {
    navigation.navigate('SellersDetails', {sellersData: sellerData} as never);
  };

  const handleSendMessage = async () => {
    try {
      const accessToken = await AsyncStorage.getItem(
        'marketplace_access_token',
      );
      console.log('Access Token:', accessToken);
      if (accessToken) {
        navigation.navigate('Messaging', {sellersData: sellerData} as never);
      } else {
        navigation.navigate('Login' as never);
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
  };

  const {toggleCurrency, showInUSD} = useCurrency();

  console.log(sellerData, 'sellerData');

  const [userID, setUserID] = useState('');
  const [seller, setSeller] = useState(false);
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(false);
  console.log(userID, product?.userId, 'userIDuserID');
  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [dispatch]),
  );

  const checkToken = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      AsyncStorage.getItem('marketplace_access_token')
        .then(accessToken => {
          if (accessToken !== null) {
            setAccessTokenExists(true);
            dispatch(fetchCurrentUser())
              .then(response => {
                setUserID(response?.payload?.currentUser?.id);
                console.log('Access Token:', accessToken);
                console.log('Profile:', response?.payload?.currentUser?.role);
                if (response?.payload?.currentUser?.id === product?.id) {
                  setSeller(true);
                } else setSeller(false);
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          } else {
            setAccessTokenExists(false);
            resolve();
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <View>
          {product?.productImages && product.productImages.length > 0 ? (
            <Image
              source={{uri: product.productImages[selectedImageIndex].image}}
              style={styles.cardImageProduct}
            />
          ) : (
            <Text>No image available</Text>
          )}
          <View style={{margin: 16, gap: 24}}>
            <ScrollView horizontal>
              {product?.productImages.map(
                (image: {image: string}, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleImageClick(index)}>
                    <Image
                      source={{uri: image.image}}
                      style={[
                        styles.smallImage,
                        index === selectedImageIndex && styles.selectedImage,
                      ]}
                    />
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
            {/* <Text onPress={handleGetSeller}>handleGetSeller</Text> */}
            <Text
              style={{fontFamily: 'Bold', fontSize: 18, paddingVertical: 16}}>
              {product?.productName}
            </Text>
            <View style={{gap: 12}}>
              <View
                style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                {/* <Text style={styles.productCurrency}>{product.currency}</Text> */}
                <Text style={styles.productCurrencyValue}>
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
                {/* <Text style={styles.productCurrencyValueLast}>
                  / {product.minOrdersAllowed}
                </Text> */}
              </View>
              <View
                style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                <Text style={styles.productCurrency}>MOQ:</Text>
                <Text style={styles.productCurrencyValue}>1</Text>
                <Text style={styles.productCurrencyValueLast}>
                  / {product.minOrdersAllowed}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                <Text style={styles.productCurrency}>Capacity</Text>
                <Text style={styles.productCurrencyValue}>
                  {product.minOrdersAllowed}
                </Text>
                <Text style={styles.productCurrencyValueLast}>/ Monthly</Text>
              </View>

              <View
                style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                <Text style={styles.productCurrency}>Delivery Duration</Text>
                <Text style={styles.productCurrencyValue}>
                  {product?.minDuration} - {product?.maxDuration}
                </Text>
              </View>
            </View>
            <View>
              <ReviewsProfileComponent productId={product?.id} />
            </View>

            {userID === product?.userId ? (
              <SellersProductActions
                onRequestQuote={toggleModal}
                buttonLabel={'Edit Product'}
              />
            ) : (
              <View>
                <ProductActions
                  sellerName={`${productData?.createdBy?.firstName}${' '}${
                    productData?.createdBy?.LastName
                  }`}
                  // sellerName={product.seller?.createdBy?.firstName}
                  onAddToCart={inCart ? handleViewCart : handleAddToCart}
                  onRequestQuote={handleRequestQuote}
                  buttonLabel={inCart ? 'View Cart' : 'Add to Cart'}
                  onStartMessage={handleSendMessage}
                  viewSellersProfile={handleViewSeller}
                />
              </View>
            )}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={toggleModal}>
              <View style={styles.modalView}>
                <View style={styles.modalContent}>
                  <Text style={styles.quoteCardTitleModal}>
                    Are you sure you want to delete this product?
                  </Text>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={toggleModal}>
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.requestQuoteButton]}
                    onPress={handleDeleteProduct}>
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.requestQuoteText,
                      ]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <View>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 16,
                  paddingVertical: 16,
                  paddingTop: 32,
                }}>
                Product Description
              </Text>
              <Text
                style={{
                  fontFamily: 'Light',
                  fontSize: 14,
                }}>
                {product?.productDescription}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 16,
                  paddingVertical: 16,
                  paddingTop: 32,
                }}>
                Product Specification
              </Text>
              <View style={{marginVertical: 16, gap: 24}}>
                {productDetails.map((detail, index) => (
                  <View
                    key={index}
                    style={[
                      styles.detailContainer,
                      index % 2 === 0 ? styles.evenBackground : null,
                    ]}>
                    <View style={styles.detailRow}>
                      <Text style={styles.boldText}>{detail.label}</Text>
                      <Text>{detail.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View>{/* <QuoteForm /> */}</View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    backgroundColor: '#eee',
    padding: 16,
    marginVertical: 8,
  },
  container: {
    backgroundColor: '#Ffffff',
    flex: 1,
  },
  productCurrency: {
    fontSize: 13,
    fontFamily: 'Light',
  },
  productCurrencyValue: {
    fontSize: 16,
    fontFamily: 'SemiBold',
  },
  productCurrencyValueLast: {
    fontSize: 13,
    fontFamily: 'SemiBold',
  },
  cardImageProduct: {
    width: '100%',
    height: 300,
  },
  smallImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 6,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'red',
  },
  detailContainer: {
    backgroundColor: '#66666625',
    padding: 16,
  },
  evenBackground: {
    backgroundColor: 'transparent',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldText: {
    fontFamily: 'Bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    width: '100%',
    borderRadius: 16,
  },
  quoteCardTitleModal: {
    paddingVertical: 16,
    fontFamily: 'Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  modalView: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '120%',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  actionButton: {
    backgroundColor: '#dc4d04',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#dc4d04',
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'SemiBold',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  requestQuoteButton: {
    backgroundColor: 'white',
  },
  requestQuoteText: {
    color: '#dc4d04',
  },
  messageButton: {
    flexDirection: 'row',
    backgroundColor: '#dc4d0412',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    padding: 12,
    borderRadius: 8,
  },
});

export default ProductDetails;
