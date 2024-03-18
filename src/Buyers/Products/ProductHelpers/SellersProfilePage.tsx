import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Svg, {Line} from 'react-native-svg';
import {StackParamList} from '../../../../Routing/Buyers/BuyersStack';
import CustomHeader from '../../../Helpers/ProductHeaders';
import Icon from 'react-native-remix-icon';
// import CountryFlag from "react-native-country-flag";
import {Product, ProductCard} from '../AllProducts';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../../Redux/store';
import {fetchCurrentUser, getUserById} from '../../../../Redux/Auth/Auth';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../../Profile/Profile';

type SellersDetailsProps = {
  route: RouteProp<StackParamList, 'SellersDetails'>;
};

type SellerData = {
  Bank?: any[]; // Assuming Bank is an array of any type
  LastName: string;
  Product: any[]; // Assuming Product is an array of any type
  address: string;
  businessDescription: string;
  businessName: string;
  businessType: string;
  country: string;
  createdAt: string;
  email: string;
  firstName: string;
  googleID: string;
  hearAboutUs: string;
  id: string;
  isEmailVerified: boolean;
  isEnabled: boolean;
  isPhoneVerified: boolean;
  phoneNumber: string;
  point: number; // Assuming point is a number
  profileImage: any; // Assuming profileImage is of any type
  referralCode: string;
  resetPasswordExpires: any; // Assuming resetPasswordExpires is of any type
  resetPasswordToken: any; // Assuming resetPasswordToken is of any type
  role: string;
  sellerStatus: string;
  subscription: any[]; // Assuming subscription is an array of any type
  supplyCapacity: string;
  totalAnnualRevenue: string;
  updatedAt: string;
  yearEstablished: string;

  message: string;
};

const SellersDetails: React.FC<SellersDetailsProps> = ({route}) => {
  const {sellersData} = route.params;
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();

  console.log(sellersData, 'proifle');
  const [sellerDatas, setSellerData] = useState<SellerData | null>(null);

  const [userID, setUserID] = useState<User | null>(null);
  const [seller, setSeller] = useState(false);
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(false);

  const checkToken = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      AsyncStorage.getItem('marketplace_access_token')
        .then(accessToken => {
          if (accessToken !== null) {
            setAccessTokenExists(true);
            dispatch(fetchCurrentUser())
              .then(response => {
                setUserID(response?.payload?.currentUser?.id);
                console.log('Access Token:', accessToken);
                console.log('Profile:', response?.payload?.currentUser?.role);
                if (response?.payload?.currentUser?.id === sellersData?.id) {
                  setSeller(true);
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

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [dispatch]),
  );

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const daySuffix = getDaySuffix(day);

    return `${day}${daySuffix} ${monthNames[monthIndex]} ${year}`;
  };

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const handlePhoneNumberPress = () => {
    Linking.openURL(`tel:${sellersData.phoneNumber}`);
  };

  const scrollRef = useRef<ScrollView | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: 0, animated: true});
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
    }
  };
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const handleProductPress = (product: Product) => () => {
    navigation.navigate('ProductDetails', {productData: product});
  };

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const action = await dispatch(getUserById(sellersData?.id));
        if (getUserById.fulfilled.match(action)) {
          setLoading(false);
          console.log('User data:', action.payload);
          setSellerData(action?.payload?.data);
        } else if (getUserById.rejected.match(action)) {
          setLoading(false);
          console.error('Error fetching user data:', action.payload);
        }
      } catch (error) {
        setLoading(false);
        console.error('Unexpected error:', error);
      }
    };

    fetchUserData();

    return () => {};
  }, [dispatch, sellersData?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      {loading ? (
        <Loader />
      ) : (
        <ScrollView style={styles.contentContainer}>
          <View>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <View
                style={{
                  backgroundColor: '#dc4d0415',
                  borderRadius: 120,
                  padding: 12,
                  width: 100,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text
                  onPress={() => console.log(sellersData, 'proifle')}
                  style={{fontFamily: 'SemiBold', color: '#dc4d04'}}>
                  Points: {sellerDatas?.point}
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 24,
                }}>
                <View style={styles.circleContainer}>
                  <Text style={styles.circleText}>
                    {sellerDatas?.LastName.charAt(0).toUpperCase()}
                    {sellerDatas?.firstName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {`${sellerDatas?.LastName} ${sellerDatas?.firstName}`}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  marginVertical: 8,
                }}>
                <Icon name="mail-line" size={14} color="#808080" />
                <Text
                  style={{
                    fontFamily: 'Regular',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#808080',
                  }}>
                  {sellerDatas?.email}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  marginBottom: 8,
                }}>
                <Icon name="phone-line" size={14} color="#808080" />
                <Text
                  style={{
                    fontFamily: 'Regular',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#808080',
                  }}
                  onPress={handlePhoneNumberPress}>
                  {sellerDatas?.phoneNumber}
                </Text>
              </View>

              {seller === true ? (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => navigation.navigate('Settings')}
                  // onPress={handleSaveChanges}
                >
                  <Text style={styles.saveButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              ) : null}
              {/* 
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                marginBottom: 8,
                backgroundColor: "#0F9E4020",
                padding: 8,
                borderRadius: 244,
                paddingHorizontal: 28,
                marginTop: 4,
              }}
            >
              <CountryFlag isoCode="ng" size={14} />

              <Text
                style={{
                  fontFamily: "Regular",
                  fontSize: 14,
                  textAlign: "center",
                  color: "#808080",
                }}
              >
                {sellerDatas?.country}
              </Text>
            </View> */}
            </View>

            {/* <View style={styles.detailsContainer}>
            {renderDetailRow("Status", sellerDatas.sellerStatus)}
            {renderDetailRow("Points", sellerDatas.point)}
            {renderDetailRow("Supply Capacity", sellerDatas.supplyCapacity)}
          </View> */}
          </View>
          <View style={{marginTop: 36}}>
            {/* <Text style={[styles.title, { fontSize: 14 }]}>
            {`${sellerDatas.LastName} ${sellerDatas.firstName}`}'s Business
            Details
          </Text> */}
            <View
              style={[
                styles.detailsContainer,
                {
                  borderWidth: 0.5,
                  borderRadius: 12,
                  padding: 12,
                  borderColor: '#80808065',
                },
              ]}>
              {renderDetailRow('Business Name', sellerDatas?.businessName)}
              {renderDetailRow('Country', sellerDatas?.country)}
              {renderDetailRow('Supply Capacity', sellerDatas?.supplyCapacity)}
              {renderDetailRow(
                'Total Annual Revenue',
                sellerDatas?.totalAnnualRevenue,
              )}
              {renderDetailRow(
                'Year Established',
                sellerDatas?.yearEstablished,
              )}
              {renderDetailRow(
                'Opened an Account',
                formatDate(sellerDatas?.createdAt),
              )}
              {renderDetailRow(
                'Updated Business Details',
                formatDate(sellerDatas?.updatedAt),
              )}
              {renderDetailRow('Referral Code', sellerDatas?.referralCode)}

              {renderAddressRow('Address', sellerDatas?.address)}
              {renderAddressRow('Business Type', sellerDatas?.businessType)}
              {renderAddressRow(
                'Business Description',
                sellerDatas?.businessDescription,
              )}
            </View>
          </View>
          <View
            style={{
              padding: 12,
              backgroundColor: '#f4f4f4',
              paddingVertical: 48,
              marginHorizontal: -16,
            }}>
            <Text style={styles.title}>
              All Products by{' '}
              {`${sellerDatas?.LastName} ${sellerDatas?.firstName}`}{' '}
            </Text>
            <ScrollView horizontal ref={scrollRef}>
              {sellerDatas?.Product?.map((item: Product) => (
                <TouchableOpacity onPress={handleProductPress(item)}>
                  <ProductCard
                    key={item.id}
                    seller={item?.createdBy?.firstName || ' '}
                    images={[item?.productImages[0]?.image]}
                    price={parseFloat(item.minPricePerUnit).toLocaleString(
                      'en-US',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                    currency={item.currency}
                    text={item.productName}
                    onPress={handleProductPress(item)}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* <TouchableOpacity onPress={handleCopyReferralCode}>
        <Icon name="clipboard-line" size={24} color="black" />
      </TouchableOpacity> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const renderDetailRow = (label: string, value: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.labelText}>{label}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const renderAddressRow = (label: string, value: any) => (
  <View style={{gap: 12, marginVertical: 16}}>
    <Text style={styles.labelText}>{label}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Bold',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Bold',
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Regular',
  },
  circleContainer: {
    backgroundColor: '#dc4d04',
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  circleText: {
    color: '#fff',
    fontFamily: 'Bold',
    fontSize: 24,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: 'Bold',
  },
  saveButton: {
    backgroundColor: '#dc4d04',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: -20,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SemiBold',
  },
});

export default SellersDetails;
