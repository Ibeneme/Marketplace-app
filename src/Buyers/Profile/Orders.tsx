import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import CustomHeader from '../../Helpers/ProductHeaders';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {User} from './Profile';
import {fetchOrdersForBuyer} from '../../../Redux/Orders/Orders';
import LoadingComponent from '../../Components/ShimmerLoader';
import {useCurrency} from '../../Helpers/CurrencyConverter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import {fetchsellersOrders} from '../../../Redux/Orders/Sellers';
const logoImage = require('../../../assets/Tofa.png');

export type Order = {
  id: string;
  title: string;
  orderNumber: string;
  currency: string;
  paymentType: string;
  origin: string;
  destination: string;
  incoterm: string;
  cost: string;
  orderHistory: {status: string; date: string}[];
  item: any;
  productName: string;
  quantityOrdered: string;
  status: string;
  paymentTerm: string;
  countryOfOrigin: string;
  shippingType: string;
  createdAt: string;
};

const orderss = [
  {
    User: {
      LastName: 'ibeneme',
      email: 'IBENEMEIKENNA96@GMAIL.COM',
      firstName: 'ikenna',
      id: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      isEmailVerified: true,
      isEnabled: true,
    },
    buyerSatisfaction: null,
    buyerSettlement: 'UNPAID',
    cost: '142.10526',
    countryOfOrigin: 'Nigeria',
    createdAt: '2023-12-14T09:58:10.065Z',
    destination: 'LAGOS',
    id: 'db905482-5695-4cde-bd1a-c9d11ec650f4',
    incoterm: 'LOCAL_DELIVERY',
    logisticsStatus: 'UNPAID',
    note: 'None',
    orderNumber: 'No.OKRXTXM',
    paymentReceipt: null,
    paymentTerm: 'PAYNOW',
    port: 'None',
    product: {
      id: '7600e3b6-5f42-4b1a-920c-6711e8b31b76',
      productDescription:
        '3pcs Wool Fabric Suite for men, available in different sizes. All our stocks are available in any quantity and colours, our store will request for your measurement and make the design best to fit for you.',
      productName: '3pcs Wool Fabric Suite for men',
      productSpecification: {},
    },
    productDescription:
      '3pcs Wool Fabric Suite for men, available in different sizes. All our stocks are available in any quantity and colours, our store will request for your measurement and make the design best to',
    productID: '7600e3b6-5f42-4b1a-920c-6711e8b31b76',
    productName: '3pcs Wool Fabric Suite for men',
    quantityOrdered: '3',
    sellerId: '21295',
    shippingType: 'LOCAL',
    status: 'PENDING',
    updatedAt: '2023-12-14T09:58:10.066Z',
    userId: '33da7e83-277a-4213-8ae8-1e6e5433591a',
  },
  {
    User: {
      LastName: 'ibeneme',
      email: 'IBENEMEIKENNA96@GMAIL.COM',
      firstName: 'ikenna',
      id: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      isEmailVerified: true,
      isEnabled: true,
    },
    buyerSatisfaction: null,
    buyerSettlement: 'UNPAID',
    cost: '8',
    countryOfOrigin: 'Nigeria',
    createdAt: '2023-12-14T09:58:10.066Z',
    destination: 'LAGOS',
    id: 'ec9275b9-ddb2-4b8b-a191-2cb510d1edf2',
    incoterm: 'LOCAL_DELIVERY',
    logisticsStatus: 'UNPAID',
    note: 'None',
    orderNumber: 'No.OKRXTXM',
    paymentReceipt: null,
    paymentTerm: 'PAYNOW',
    port: 'None',
    product: {
      id: '0e0ab9f9-ca4a-4d96-9bb1-17e615ae6f8b',
      productDescription:
        'Cooking oil extracted as a by-product, from peanut cookies production',
      productName: 'Kulikuli oil (peanut cookies oil)',
      productSpecification: {},
    },
    productDescription:
      'Cooking oil extracted as a by-product, from peanut cookies production',
    productID: '0e0ab9f9-ca4a-4d96-9bb1-17e615ae6f8b',
    productName: 'Kulikuli oil (peanut cookies oil)',
    quantityOrdered: '2',
    sellerId: 'd0ba0fb3-b8c2-4639-af1e-39fd6aafc8ac',
    shippingType: 'LOCAL',
    status: 'PENDING',
    updatedAt: '2023-12-14T09:58:10.066Z',
    userId: '33da7e83-277a-4213-8ae8-1e6e5433591a',
  },
];

export type OrdersProps = {};

type OrderInfoProps = {
  order: Order;
};

const OrderInfo: React.FC<OrderInfoProps> = ({order}) => (
  <View style={styles.orderInfoContainer}>
    <Text style={styles.orderInfoTitle}>Order Info</Text>
    <View style={styles.orderDetailsContainer}>
      <Text style={styles.orderDetailLabel}>Product Name</Text>
      <Text style={styles.orderDetailValue}>{order.productName}</Text>

      <Text style={styles.orderDetailLabel}>Order Number</Text>
      <Text style={styles.orderDetailValue}>{order.orderNumber}</Text>

      <Text style={styles.orderDetailLabel}>Total Cost</Text>
      <Text style={styles.orderDetailValue}>{order.cost}</Text>

      <Text style={styles.orderDetailLabel}>Payment Type</Text>
      <Text style={styles.orderDetailValue}>{order.paymentType}</Text>

      <Text style={styles.orderDetailLabel}>Origin</Text>
      <Text style={styles.orderDetailValue}>{order.origin}</Text>

      <Text style={styles.orderDetailLabel}>Destination</Text>
      <Text style={styles.orderDetailValue}>{order.destination}</Text>

      <Text style={styles.orderDetailLabel}>Incoterms</Text>
      <Text style={styles.orderDetailValue}>{order.incoterm}</Text>

      <Text style={styles.orderDetailLabel}>Notes</Text>
      <Text style={styles.orderDetailValue}>{order.cost}</Text>
    </View>

    <Text style={styles.orderHistoryTitle}>Order History</Text>
    <FlatList
      data={order.orderHistory}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={styles.historyItem}>
          <Text>{item.status}</Text>
          <Text>{item.date}</Text>
        </View>
      )}
    />
  </View>
);

const Orders: React.FC<OrdersProps> = ({}) => {
  const {toggleCurrency, showInUSD} = useCurrency();
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [ordersData, setOrders] = useState<Order[]>([]);
  const [ordersCount, setOrdersCount] = useState('');
  const [rfqsCount, setRfqsCount] = useState(0);
  const [userID, setUserID] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState<number>(0);
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
                setUserID(response?.payload?.currentUser);

                console.log('Access Token:', accessToken);
                console.log('Profile:', response?.payload?.currentUser?.role);
                if (response?.payload?.currentUser?.role === 'SELLER') {
                  setSeller(true);
                  dispatch(fetchsellersOrders())
                    .then(response => {
                      setOrders(response?.payload?.data?.orders);
                      setLoading(false);
                      setOrdersCount(
                        response?.payload?.data?.pagination?.totalOrders,
                      );
                      const pendingCount =
                        response?.payload?.data?.orders.filter(
                          (order: Order) => order.status === 'PENDING',
                        ).length;
                      const completedCount =
                        response?.payload?.data?.orders.filter(
                          (order: Order) => order.status !== 'PENDING',
                        ).length;
                      setPendingOrdersCount(pendingCount);
                      setCompletedOrdersCount(completedCount);
                      console.log(
                        'Orders fetched successfully',
                        response?.payload?.data?.orders,
                      );
                    })
                    .catch(error => {
                      setLoading(false);
                      // console.error("Error fetching orders:", error);
                    });
                } else setSeller(false);
                setLoading(false);
                resolve();
              })
              .catch(error => {
                console.error('Error while fetching current user:', error);
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
          console.error('Error while checking token:', error);
          setLoading(false);
          reject(error);
        });
    });
  };

  const fetchOrders = () => {
    setLoading(true);
    if (seller === true) {
      dispatch(fetchsellersOrders())
        .then(response => {
          setOrders(response?.payload?.data?.orders);
          setLoading(false);
          setOrdersCount(response?.payload?.data?.pagination?.totalOrders);
          const pendingCount = response?.payload?.data?.orders.filter(
            (order: Order) => order.status === 'PENDING',
          ).length;
          const completedCount = response?.payload?.data?.orders.filter(
            (order: Order) => order.status !== 'PENDING',
          ).length;
          setPendingOrdersCount(pendingCount);
          setCompletedOrdersCount(completedCount);
          console.log(
            'Orders fetched successfully',
            response?.payload?.data?.orders,
          );
        })
        .catch(error => {
          setLoading(false);
          // console.error("Error fetching orders:", error);
        });
    } else {
      dispatch(fetchOrdersForBuyer())
        .then(response => {
          setOrders(response?.payload?.data?.orders);
          setLoading(false);
          setOrdersCount(response?.payload?.data?.pagination?.totalOrders);
          const pendingCount = response?.payload?.data?.orders.filter(
            (order: Order) => order.status === 'PENDING',
          ).length;
          const completedCount = response?.payload?.data?.orders.filter(
            (order: Order) => order.status !== 'PENDING',
          ).length;
          setPendingOrdersCount(pendingCount);
          setCompletedOrdersCount(completedCount);
          console.log(
            'Orders fetched successfully',
            response?.payload?.data?.orders,
          );
        })
        .catch(error => {
          setLoading(false);
          // console.error("Error fetching orders:", error);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
    checkToken();
  }, []);
  // const ordersData = [
  //   {
  //     id: "1",
  //     title: "3pcs wool fabric suite for men",
  //     orderNumber: "No.OKRXTXM",
  //     totalCost: "USD 142.11",
  //     paymentType: "PAYNOW",
  //     origin: "Nigeria",
  //     destination: "LAGOS",
  //     incoterms: "LOCAL_DELIVERY",
  //     notes: "None",
  //     orderHistory: [
  //       { status: "Order Received", date: "14 Dec, 2023" },
  //       { status: "Payment", date: "14 Dec, 2023" },
  //       { status: "Order Shipped", date: "15 Dec, 2023" },
  //       { status: "Order Delivered", date: "16 Dec, 2023" },
  //       { status: "Order not received", date: "17 Dec, 2023" },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     title: "12pcs wool fabric suite for men",
  //     orderNumber: "No.OKRXTXM",
  //     totalCost: "USD 142.11",
  //     paymentType: "PAYNOW",
  //     origin: "Nigeria",
  //     destination: "LAGOS",
  //     incoterms: "LOCAL_DELIVERY",
  //     notes: "None",
  //     orderHistory: [
  //       { status: "Order Received", date: "14 Dec, 2023" },
  //       { status: "Payment", date: "14 Dec, 2023" },
  //       { status: "Order Shipped", date: "15 Dec, 2023" },
  //       { status: "Order Delivered", date: "16 Dec, 2023" },
  //       { status: "Order not received", date: "17 Dec, 2023" },
  //     ],
  //   },
  //   // Add more orders as needed
  // ];

  const handleCardPress = (status: string) => {
    setSelectedStatus(status);
  };

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.orderCard}
  //     onPress={() => navigation.navigate("OrderDetails", { order: item })}
  //   >
  //     <View>
  //       <Text style={styles.orderTitle}>{item.title}</Text>
  //       <Text>{item.totalCost}</Text>
  //       <Text>{item.orderNumber}</Text>
  //     </View>
  //     <View style={styles.arrowContainer}>
  //       <Text style={styles.arrow}>→</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  //   User: Ikenna Ibeneme (ID: 33da7e83-277a-4213-8ae8-1e6e5433591a)
  // Email: IBENEMEIKENNA96@GMAIL.COM
  // Last Name: Ibeneme
  // First Name: Ikenna
  // Product: 3pcs Wool Fabric Suite for Men (ID: 7600e3b6-5f42-4b1a-920c-6711e8b31b76)
  // Description: 3pcs Wool Fabric Suite for men, available in different sizes. All our stocks are available in any quantity and colors, our store will request for your measurement and make the design best to fit for you.
  // Quantity Ordered: 3
  // Order Details:
  // Order Number: No.OKRXTXM
  // Total Cost: $142.10526
  // Country of Origin: Nigeria
  // Destination: Lagos
  // Incoterm: LOCAL_DELIVERY
  // Payment Term: PAYNOW
  // Shipping Type: LOCAL
  // Status: PENDING
  // Logistics:
  // Buyer Settlement: UNPAID
  // Logistics Status: UNPAID
  // Additional Notes: None
  // Created At: 2023-12-14T09:58:10.065Z
  // Updated At: 2023-12-14T09:58:10.06

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Orders" />
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#f4f4f4',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#f4f4f4',
              paddingTop: 24,
            }}>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.text}>Total Orders</Text>
              <Text style={styles.numbers}>{ordersCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.text}>Ongoing Orders</Text>
              <Text style={styles.numbers}>{pendingOrdersCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.text}>Completed Orders</Text>
              <Text style={styles.numbers}>{completedOrdersCount}</Text>
            </TouchableOpacity>

            <View
              style={{
                margin: 12,
                borderRadius: 12,
                backgroundColor: '#fff',
              }}>
              <View style={styles.statusToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedStatus === 'all' && styles.selectedToggle,
                  ]}
                  onPress={() => handleCardPress('all')}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Regular',
                      paddingHorizontal: 4,
                    }}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedStatus === 'pending' && styles.selectedToggle,
                  ]}
                  onPress={() => handleCardPress('pending')}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Regular',
                      paddingHorizontal: 4,
                    }}>
                    Ongoing
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedStatus === 'completed' && styles.selectedToggle,
                  ]}
                  onPress={() => handleCardPress('completed')}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Regular',
                      paddingHorizontal: 4,
                    }}>
                    Completed
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={ordersData?.filter(
                  order =>
                    selectedStatus === 'all' ||
                    (selectedStatus === 'pending' &&
                      order.status === 'PENDING') ||
                    (selectedStatus === 'completed' &&
                      order.status !== 'PENDING'),
                )}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View style={styles.noOrdersContainer}>
                    <Text style={styles.noOrdersText}>No orders found</Text>
                  </View>
                )}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.orderCard}
                    onPress={() =>
                      //console.log(item)
                      navigation.navigate('OrderDetails', {
                        order: {item} as never,
                      })
                    }>
                    <View>
                      <Text style={styles.orderTitle}>{item.productName}</Text>
                      <Text>Qty: {item.quantityOrdered}</Text>
                      <Text>
                        {' '}
                        {showInUSD
                          ? `NGN ${(
                              parseFloat(item?.cost) * 1400
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : `USD ${parseFloat(item?.cost).toLocaleString(
                              'en-US',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}`}
                      </Text>
                      <Text>Order No: {item.orderNumber}</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Text style={styles.arrow}>→</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* <FlatList
              data={ordersData?.filter((order) => {
                if (selectedStatus === "all") return true;
                return order.orderHistory.some(
                  (history) => history.status.toLowerCase() === selectedStatus
                );
              })}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.orderCard}
                  // onPress={() =>
                  //   navigation.navigate("OrderDetails", { order: { ...item } })
                  // }
                >
                  <View>
                    <Text style={styles.orderTitle}>{item.productName}</Text>
                    <Text>Qty: {item.quantityOrdered}</Text>
                    <Text>${item.cost}</Text>
                    <Text>Order No: {item.orderNumber}</Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </TouchableOpacity>
              )}
            /> */}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusToggle: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    marginTop: 16,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  selectedToggle: {
    backgroundColor: '#dc4d0425',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 16,
    fontFamily: 'Bold',
  },
  arrowContainer: {
    alignSelf: 'flex-end',
  },
  arrow: {
    fontSize: 24,
  },
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    paddingVertical: 24,
    borderRadius: 8,
    marginBottom: 12,
    height: 100,
    elevation: 2,
    marginHorizontal: 12,
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
  orderInfoContainer: {
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderDetailsContainer: {},
  orderDetailLabel: {
    fontSize: 16,
    fontFamily: 'Bold',
    marginTop: 8,
  },
  orderDetailValue: {
    fontSize: 14,
    fontFamily: 'Regular',
    marginTop: 4,
  },
  orderHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  noOrdersContainer: {
    backgroundColor: '#Fff',
    padding: 12,
    width: '100%',
  },
  noOrdersText: {
    fontFamily: 'Regular',
    textAlign: 'center',
    marginVertical: 120,
  },
});

export default Orders;
