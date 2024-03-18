import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import Icon from 'react-native-remix-icon';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {fetchOrdersForBuyer} from '../../../Redux/Orders/Orders';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import {
  getAllRFG,
  getAllRFGMultiple,
  getAllRFGMultipleSeller,
  getAllRFGSeller,
} from '../../../Redux/RFG/RFG';
import LoadingComponent from '../../Components/ShimmerLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {getAllMessages} from '../../../Redux/Messages/Messages';
import {Message} from '../Messages/SendMessage';
import {fetchsellersOrders} from '../../../Redux/Orders/Sellers';
import {SellersData} from '../../../Routing/Buyers/Types';
import {getDashboardData} from '../../../Redux/Profile/Profile';
import {sellersProduct} from '../../../Redux/Product/Product';
const logoImage = require('../../../assets/Tofa.png');
type ProfileProps = {};

export interface User {
  id: string;
  firstName: string;
  LastName: string;
  email: string;
  address: string;
  country: string;
  phoneNumber: string;
  createdAt: string;
  businessName: string;
  businessType: string;
  isEmailVerified: string;
  point: string;
  referralCode: string;
}

const Profile: React.FC<ProfileProps> = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [orders, setOrders] = useState('');
  const [isSellersActive, setIsSellersActive] = useState(false); // State variable to track sellers' activity

  const [ordersCount, setOrdersCount] = useState(0);
  const [messagesCount, setMessages] = useState(0);
  const [rfqsCount, setRfqsCount] = useState(0);
  const [rfqsCountMultiple, setRfqsCountMultiple] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productData, setProductData] = useState([]);

  const [ordersCountSeller, setOrdersCountSeller] = useState(0);
  const [messagesCountSeller, setMessagesSeller] = useState(0);
  const [rfqsCountSeller, setRfqsCountSeller] = useState(0);
  const [rfqsCountMultipleSeller, setRfqsCountMultipleSeller] = useState(0);

  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState('');
  const [userID, setUserID] = useState<User | 'Login to Proceed'>(
    'Login to Proceed',
  );
  const [seller, setSeller] = useState(false);
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(false);
  const [sellerData, setSellerData] = useState<SellersData | []>([]);

  console.log(sellerData, 'sellerDatasellerData');
  const checkToken = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      AsyncStorage.getItem('marketplace_access_token')
        .then(accessToken => {
          if (accessToken !== null) {
            setAccessTokenExists(true);
            dispatch(fetchCurrentUser())
              .then(response => {
                setUserID(response?.payload?.currentUser);
                const userID = response?.payload?.currentUser;
                console.log('Access Token:', accessToken);
                //console.log('Profile:', response?.payload?.currentUser?.role);
                if (response?.payload?.currentUser?.role === 'SELLER') {
                  setSeller(true);
                  dispatch(getDashboardData(userID))
                    .then((response: any) => {
                      console.log('Access response:', response?.meta?.arg);
                      const seller: SellersData = response?.meta?.arg;
                      setSellerData(seller);
                    })
                    .catch((error: any) => {
                      console.error(
                        'Error while fetching current user:',
                        error,
                      );
                    });
                } else setSeller(false);
                setLoading(false);
                resolve();
              })
              .catch(error => {
                // console.error('Error while fetching current user:', error);
                setLoading(false);
                reject(error);
              });
          } else {
            setAccessTokenExists(false);
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
    setLoading(true);
    checkToken()
      .then(() => {
        Promise.all([fetchOrders(), fetchRfqsMupltiple()])
          .then(() => {
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            //console.error('Error fetching data:', error);
          });
      })
      .catch(error => {
        setLoading(false);
        //console.error('Error checking token:', error);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
      getSellersProduct();
      setLoading(true);
      fetchOrders();
      AllMessages();
      fetchRfqsMupltiple();
      fetchOrdersSeller();
      fetchSellerRfg();
      fetchMultipleSellerRfg();
    }, [dispatch]),
  );

  const AllMessages = () => {
    dispatch(getAllMessages())
      .then(action => {
        setLoading(false);
        if (getAllMessages.fulfilled.match(action)) {
          const response = action.payload;
          const filteredMessages = response?.data?.filter(
            (item: any) => item?.message?.senderID === userID,
          );
          filteredMessages.sort((a: any, b: any) => {
            const aTime =
              a.message.response[0]?.updatedAt ?? a.message.updatedAt;
            const bTime =
              b.message.response[0]?.updatedAt ?? b.message.updatedAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });

          setMessages(filteredMessages?.length);
          //console.log('Number of messagesss:', filteredMessages.length);
        }
      })
      .catch(error => {
        setLoading(false);
        // console.error('Error fetching messages:', error);
      });
  };

  useEffect(() => {
    setLoading(true);
    AllMessages();
    getSellersProduct();
  }, [dispatch, userID]);

  const fetchOrders = () => {
    setLoading(true);
    dispatch(fetchOrdersForBuyer())
      .then(response => {
        setLoading(false);
        setOrders(response?.payload?.data?.orders);
        setOrdersCount(response?.payload?.data?.pagination?.totalOrders);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const fetchOrdersSeller = () => {
    setLoading(true);
    dispatch(fetchsellersOrders())
      .then((response: any) => {
        setLoading(false);
        if (response) {
          setOrdersCountSeller(response.payload?.data?.pagination?.totalOrders);
          console.log(
            'sellerrrrr fetched successfully',
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

  const fetchSellerRfg = () => {
    setLoading(true);
    dispatch(getAllRFGSeller())
      .then((response: any) => {
        setLoading(false);
        if (response) {
          setRfqsCountSeller(response.payload?.data?.pagination?.totalOrders);
          console.log(
            'sellerrrrr fetched successfully',
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

  const fetchMultipleSellerRfg = () => {
    setLoading(true);
    dispatch(getAllRFGMultipleSeller())
      .then((response: any) => {
        setLoading(false);
        if (response) {
          setRfqsCountMultipleSeller(
            response.payload?.data?.pagination?.totalOrders,
          );
          console.log(
            'RFGSELL fetched successfully',
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

  const getSellersProduct = () => {
    setLoading(true);
    console.log(userID?.id, 'userID?.id');
    dispatch(sellersProduct(userID?.id))
      .then((response: any) => {
        setLoading(false);
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

  const fetchRfqsMupltiple = () => {
    setLoading(true);
    Promise.all([dispatch(getAllRFG()), dispatch(getAllRFGMultiple())])
      .then(([rfqResponse, multipleRfqResponse]) => {
        setLoading(false);
        setRfqsCount(rfqResponse?.payload?.data?.pagination?.totalPages);
        setRfqsCountMultiple(
          multipleRfqResponse?.payload?.data?.pagination?.totalPages,
        );
        console.log('RFQs and multiple RFQs fetched successfully');
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching RFQs and multiple RFQs:', error);
      });
  };

  const buyersProfile = (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.profileHeader,
          {
            backgroundColor: '#dc4d04',
            paddingVertical: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('ProfileDetails', {
              profile: userID,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 6,
            }}>
            <Text style={styles.userName}>
              {accessTokenExists
                ? `${userID?.firstName} ${userID?.LastName}`
                : 'Login to get Started'}
            </Text>
          </View>
          <Text style={{fontSize: 13, color: 'white'}}>View Profile</Text>
        </View>

        <Icon name="arrow-drop-right-line" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('Orders', {
              profile: userID,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>My Orders</Text>
          <Text style={styles.numbers}>{ordersCount ? ordersCount : 0}</Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('AllMessageComponent', {
              profile: userID,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Message Center</Text>
          <Text style={styles.numbers}>{messagesCount}</Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('RFG', {
              profile: userID,
            } as never);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>RFQs</Text>
          <Text style={styles.numbers}>{rfqsCount ? rfqsCount : 0}</Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('RfgMultiple', {
              profile: userID,
            } as never);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Multiple RFQs</Text>
          <Text style={styles.numbers}>
            {rfqsCountMultiple ? rfqsCountMultiple : 0}
          </Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>
    </View>
  );
  console.log(productCount, productData, 'productCount');

  const sellerProfile = (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.profileHeader,
          {
            backgroundColor: '#041C30',
            paddingVertical: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('SellersDetails', {
              sellersData: sellerData,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 6,
            }}>
            <Text style={styles.userName}>
              {accessTokenExists
                ? `${userID?.firstName} ${userID?.LastName}`
                : 'Login to get Started'}
            </Text>
          </View>
          <Text style={{fontSize: 13, color: 'white'}}>View Profile</Text>
        </View>

        <Icon name="arrow-drop-right-line" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // if (accessTokenExists) {
          //   navigation.navigate('SellProductForm', {
          //     profile: userID,
          //   } as never);
          if (accessTokenExists) {
            navigation.navigate('SellersProductPage', {
              productData: productData,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Products</Text>
          <Text style={styles.numbers}>{productCount ? productCount : 0}</Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('Orders', {
              profile: userID,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Seller Orders</Text>
          <Text style={styles.numbers}>
            {ordersCountSeller ? ordersCountSeller : 0}
          </Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('AllMessageComponent', {
              profile: userID,
            } as never);
            setAccessTokenExists(false);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Message Center</Text>
          <Text style={styles.numbers}>{messagesCount}</Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('RFG', {
              profile: userID,
            } as never);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Seller RFQs</Text>
          <Text style={styles.numbers}>
            {rfqsCountSeller ? rfqsCountSeller : 0}
          </Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (accessTokenExists) {
            navigation.navigate('RfgMultiple', {
              profile: userID,
            } as never);
          } else {
            navigation.navigate('Login' as never);
          }
        }}>
        <View>
          <Text style={styles.text}>Seller Multiple RFQs</Text>
          <Text style={styles.numbers}>
            {rfqsCountMultipleSeller ? rfqsCountMultipleSeller : 0}
          </Text>
        </View>
        <Icon name="arrow-drop-right-line" size={24} color="#121212" />
      </TouchableOpacity>
    </View>
  );

  const [toggleState, setToggleState] = useState<'buyers' | 'sellers'>(
    'buyers',
  );

  const toggle = () => {
    setIsSellersActive(!isSellersActive);
    setToggleState(prevState =>
      prevState === 'buyers' ? 'sellers' : 'buyers',
    );
  };

  return (
    <>
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : !seller ? (
        buyersProfile
      ) : (
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 12,
              backgroundColor: isSellersActive ? '#041C30' : '#dc4d04', // Conditionally set background color
              borderRadius: 45,
              padding: 6,
              paddingHorizontal: 4,
              margin: 12,
              width: 'auto',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={[
                styles.button,
                toggleState === 'buyers'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={toggle}>
              <Text
                style={[
                  styles.buttonText,
                  toggleState === 'buyers'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                ]}>
                Buyers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                toggleState === 'sellers'
                  ? styles.activeButton
                  : styles.inactiveButton,
              ]}
              onPress={toggle}>
              <Text
                style={[
                  styles.buttonText,
                  toggleState === 'sellers'
                    ? styles.activeButtonText
                    : styles.inactiveButtonText,
                ]}>
                Sellers
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            {toggleState === 'buyers' ? buyersProfile : sellerProfile}
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inactiveButtonText: {
    textAlign: 'center',
  },
  inactiveButton: {
    //backgroundColor: '#fff',
    borderRadius: 455,
    width: '47%',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 12,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    //borderWidth: 1,
    borderRadius: 5,
    //borderColor: '#dc4d04',
    alignItems: 'center',
    textAlign: 'center',
  },
  activeButton: {
    backgroundColor: '#fff',
    borderRadius: 455,
    width: '47%',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 12,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#dc4d04',
    fontSize: 16,
    textAlign: 'center',
  },

  container: {
    padding: 16,
    paddingBottom: 260,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  initials: {
    fontSize: 24,
    color: 'white',
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    paddingVertical: 24,
    borderRadius: 8,
    marginBottom: 12,
    height: 100,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Regular',
  },
  numbers: {
    fontSize: 24,
    fontFamily: 'Bold',
    marginTop: 6,
  },
});

export default Profile;
