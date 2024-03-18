import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {CartItem, useCartContext} from '../../Context/CartContext';
import Icon from 'react-native-remix-icon';
import {User} from '../Profile/Profile';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import {sendBulkOrder} from '../../../Redux/Orders/Orders';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCurrency} from '../../Helpers/CurrencyConverter';

type Props = {};
const Cart = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const [userID, setUserID] = useState<User | null>(null);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [name, setName] = useState<string>('Enter Full Name');
  const [phoneNumber, setPhoneNumber] = useState('Enter Phone Number');
  const [address, setAddress] = useState('Enter Address');
  const [country, setCountry] = useState('Enter Country');

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .then((response: any) => {
        console.log(response?.payload?.currentUser);
        const currentUser = response?.payload?.currentUser;
        setUserID(currentUser);
        if (currentUser) {
          setName(currentUser.LastName + ' ' + currentUser.firstName);
          setPhoneNumber(currentUser.phoneNumber);
          setAddress(currentUser.address);
          setCountry(currentUser?.country);
        }
      })
      .catch((error: any) => {
        console.log('Error fetching current user:', error);
      });
  }, [dispatch]);

  const [isEditing, setIsEditing] = useState(false);
  const [isShippingDetailsVisible, setShippingDetailsVisible] = useState(false);
  const [deliveryType, setDeliveryType] = useState('LOCAL');
  const [incoterm, setIncoterm] = useState('No mode of delivery selected');
  const [selectedIncoterm, setSelectedIncoterm] = useState('');
  const [port, setPort] = useState('');

  const handleSave = () => {
    setSubmitErr('');
    setIsEditing(false);
  };

  const handleIncotermChange = (value: string) => {
    setSelectedIncoterm(value);
    if (value === 'local') {
      setIncoterm('Local Delivery');
      setPort('');
    } else {
      setIncoterm(value);
      const requiresPort =
        value === 'FOB' || value === 'CIF' || value === 'CFR';

      if (requiresPort) {
        setPort('');
      } else {
        setPort('');
      }
    }
  };

  const handlePortChange = (value: string) => {
    setPort(value);
  };

  const {toggleCurrency, showInUSD} = useCurrency();
  console.log(showInUSD, 'showInUSD');
  const [isPaymentDetailsVisible, setPaymentDetailsVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [currency, setCurrency] = useState(showInUSD ?'NGN' :'USD');

  useEffect(() => {
    setCurrency(showInUSD ?'NGN' :'USD');
  }, [showInUSD]);
  const [submitErr, setSubmitErr] = useState('');

  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
    setCurrency('');
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };
  const [note, setNote] = useState('Add Note');
  const [isNoteEditing, setIsNoteEditing] = useState(false);
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem(
          'marketplace_access_token',
        );
        console.log('Access Token:', accessToken);
        if (accessToken) {
          setAccessTokenExists(true);
          console.log('Profile');
        } else {
        }
      } catch (error) {
        console.error('Error retrieving access token:', error);
      }
    };

    checkToken();
  }, []);
  // Function to handle saving the edited note
  const handleSaveNote = () => {
    // Perform any validation or processing if needed
    setIsNoteEditing(false); // Disable editing mode
  };

  const {cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart} =
    useCartContext();
  const [inCart, setInCart] = useState(false);
  console.log(cart, 'll');
  const handleContinueShopping = () => {
    navigation.navigate('Home' as never);
  };

  const handleSignin = () => {
    if (accessTokenExists) {
      // Set notes to "No notes" if the current value is "Add Note"
      if (note === 'Add Note') {
        setNote('None');
      }

      if (
        name !== 'Enter Full Name' &&
        name.trim() !== '' &&
        phoneNumber !== 'Enter Phone Number' &&
        phoneNumber.trim() !== '' &&
        address !== 'Enter Address' &&
        address.trim() !== '' &&
        country !== 'Enter Country' &&
        country.trim() !== ''
      ) {
        if (
          (deliveryType === 'LOCAL' &&
            incoterm !== 'No mode of delivery selected') ||
          (deliveryType === 'FOREIGN' &&
            incoterm !== 'No mode of delivery selected' &&
            port !== '')
        ) {
          // Check if a payment method is selected
          if (selectedPaymentMethod !== '') {
            // If both shipping details and payment method are filled, proceed with payment
            console.log('Payment initiated...');
            handleSendBulkOrder();
            setSubmitErr(''); // Clear the error message
          } else {
            // If payment method is not selected, set an error message
            console.log('Error: Please select a payment method.');
            setSubmitErr('Please select a payment method.');
          }
        } else {
          // If shipping details are not filled, set an error message
          console.log('Error: Please complete the shipping details.');
          setSubmitErr('Please complete the shipping details.');
        }
      } else {
        // If user details are not filled, set an error message
        console.log('Error: Please complete all user details.');
        setSubmitErr('Please complete all user details.');
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSendBulkOrder = () => {
    const cartJSONString: string = JSON.stringify(cart);
    const parsedCart: CartItem[] = JSON.parse(cartJSONString);
    const formattedItems = parsedCart.map(item => ({
      productID: item.id,
      sellerId: item.seller,
      cost: item.price,
      quantityOrdered: item.quantity.toString(),
      productName: item.text,
      productDescription: item.description,
      countryOfOrigin: item?.countryOfOrigin,
      logisticsStatus: 'UNPAID',
    }));

    // //console.log(formattedItems);
    // const bulkOrder = {
    //   bulkOrder: formattedItems,
    //   destination:
    //     "5 Mosudi jokoenumi close, salvation estate, scheme 1, Lamgbasa Aja",
    //   port: "None",
    //   note: "None",
    //   incoterm: "LOCAL_DELIVERY",
    //   shippingType: "LOCAL",
    //   paymentTerm: "TRANSFER",
    // };

    // // Convert the object to a JSON string
    // const jsonString = JSON.stringify(bulkOrder);

    const requestData = {
      bulkOrder: formattedItems,
      destination: address,
      port: port ? port : 'None',
      note: note,
      incoterm: incoterm,
      shippingType: deliveryType,
      paymentTerm: selectedPaymentMethod,
    };
    dispatch(sendBulkOrder(requestData))
      .then(actionResult => {
        //console.log(jsonString, "bulkorderbulkorder");
        console.log('Bulk order sent successfully:', actionResult);
        console.log('Bulk order sent successfully:', actionResult);
        if (actionResult?.meta?.requestStatus === 'fulfilled') {
          navigation.navigate('CartSuccess', {
            currency: currency,
            amount: totalItemCost,
          });
          clearCart();
        }
      })
      .catch(error => {
        console.error('Error sending bulk order:', error);
      });
  };

  const handleSigning = () => {
    navigation.navigate('ChooseSignupOption' as never);
  };

  const NGNTODOLLAR = 1400;

  const calculateTotalCost = () => {
    let totalCost = 0;

    for (const cartItem of cart) {
      // Convert price to USD if currency is NGN
      const priceInUSD =
        currency === 'NGN' ? cartItem.price * NGNTODOLLAR : cartItem.price;
      totalCost += priceInUSD * cartItem.quantity;
    }

    const VAT = parseFloat((0.1 * totalCost).toFixed(2));

    const roundedTotalCost = parseFloat((totalCost + VAT).toFixed(2));

    return roundedTotalCost;
  };

  const totalItemCost = calculateTotalCost();
  const totalItemCostWithoutVAT = totalItemCost - totalItemCost / 11;
  const roundedTotalItemCost = parseFloat(totalItemCostWithoutVAT.toFixed(2));
  const roundedVAT = parseFloat((roundedTotalItemCost / 10).toFixed(2));

  return (
    <View>
      <ScrollView>
        {cart?.length === 0 ? (
          <View
            style={{
              backgroundColor: '#fff',
              margin: 16,
              padding: 16,
              alignItems: 'center',
              gap: 16,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 16,
                  paddingTop: 24,
                  textAlign: 'center',
                }}>
                Cart is empty
              </Text>
              <Text
                style={{
                  fontFamily: 'Regular',
                  fontSize: 13,
                  paddingTop: 4,
                  textAlign: 'center',
                  color: '#666',
                  paddingBottom: 16,
                }}>
                Start Shopping to enjoy your experience
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#dc4d0425',
                padding: 16,
                borderRadius: 256,
              }}>
              <Icon name="shopping-cart-line" size={48} color="#dc4d04" />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#dc4d04',
                marginVertical: 24,
                borderRadius: 12,
                height: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleContinueShopping}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Bold',
                  fontSize: 14,
                }}>
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userDetailsTitle}>User Details</Text>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.userInfoInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                />
              ) : (
                <Text style={styles.userInfoText}>{name}</Text>
              )}
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.userInfoInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone Number"
                />
              ) : (
                <Text style={styles.userInfoText}>{phoneNumber}</Text>
              )}
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.userInfoInput}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Address"
                />
              ) : (
                <Text style={styles.userInfoText}>{address}</Text>
              )}
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Country</Text>
              {isEditing ? (
                <TextInput
                  style={styles.userInfoInput}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Country"
                />
              ) : (
                <Text style={styles.userInfoText}>{country}</Text>
              )}
            </View>
            {isEditing ? (
              <TouchableOpacity style={styles.editButton} onPress={handleSave}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Shipping Details Card */}
        <TouchableOpacity
          style={styles.userDetailsContainer}
          onPress={() => setShippingDetailsVisible(true)}>
          <Text style={styles.userDetailsTitle}>Shipping Details</Text>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Incoterm</Text>
              <Text style={styles.userInfoText}>{incoterm}</Text>
            </View>
            {selectedIncoterm === 'foreign' && (
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoLabel}>Port</Text>
                <Text style={styles.userInfoText}>{port}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShippingDetailsVisible(true)}>
              <Text style={styles.editButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Shipping Details Modal */}
        <Modal
          transparent={true}
          visible={isShippingDetailsVisible}
          onRequestClose={() => setShippingDetailsVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Delivery Type</Text>
              <Dropdown
                style={styles.input}
                labelField="label"
                valueField="value"
                value={deliveryType}
                maxHeight={800}
                placeholder="Delivery Type"
                data={[
                  {value: 'LOCAL', label: 'LOCAL'},
                  {value: 'FOREIGN', label: 'FOREIGN'},
                ]}
                onChange={value => setDeliveryType(value?.value)}
              />
              {deliveryType === 'LOCAL' ? (
                <Dropdown
                  style={styles.input}
                  labelField="label"
                  valueField="value"
                  placeholder="Incoterm"
                  data={[
                    {
                      value: 'No mode of delivery selected',
                      label: 'No mode of delivery selected',
                    },
                    {value: 'LOCAL_DELIVERY', label: 'LOCAL_DELIVERY'},
                  ]}
                  value={incoterm}
                  onChange={value => handleIncotermChange(value?.value)}
                />
              ) : (
                <Dropdown
                  style={styles.input}
                  labelField="label"
                  valueField="value"
                  placeholder="Incoterm"
                  data={[
                    {
                      value: 'No mode of delivery selected',
                      label: 'No mode of delivery selected',
                    },
                    {value: 'FOB', label: 'FOB'},
                    {value: 'CIF', label: 'CIF'},
                    {value: 'CFR', label: 'CFR'},
                  ]}
                  value={incoterm}
                  onChange={value => handleIncotermChange(value?.value)}
                />
              )}
              {deliveryType === 'foreign' ? (
                <View>
                  <Text style={styles.modalLabel}>Port</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={port}
                    onChangeText={value => handlePortChange(value)}
                    placeholder="Port"
                  />
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setShippingDetailsVisible(false);
                  handleSave(); // You can perform save logic here
                }}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.userDetailsContainer}
          onPress={() => setPaymentDetailsVisible(true)}>
          <Text style={styles.userDetailsTitle}>Payment Method</Text>
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Select a Payment Method</Text>
              <Text style={styles.userInfoText}> {selectedPaymentMethod}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Select a Currency</Text>
              <Text style={styles.userInfoText}> {currency}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setPaymentDetailsVisible(true)}>
              <Text style={styles.editButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Payment Method Modal */}
        <Modal
          transparent={true}
          visible={isPaymentDetailsVisible}
          onRequestClose={() => setPaymentDetailsVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={[
                  styles.modalTitle,
                  {
                    fontFamily: 'Bold',
                    fontSize: 16,
                    paddingVertical: 16,
                    paddingTop: 32,
                  },
                ]}>
                Select a Payment Method
              </Text>
              <Dropdown
                style={styles.input}
                labelField="label"
                valueField="value"
                placeholder="Select Currency"
                data={[
                  {value: 'USD', label: 'USD'},
                  //{ value: "EURO", label: "EURO" },
                  {value: 'NGN', label: 'NGN'},
                  // { value: "XOF", label: "XOF" },
                  // { value: "GHS", label: "GHS" },
                  // { value: "GBP", label: "GBP" },
                ]}
                value={currency}
                onChange={value => setCurrency(value?.value)}
              />

              <Dropdown
                style={styles.input}
                labelField="label"
                valueField="value"
                value={selectedPaymentMethod}
                maxHeight={800}
                placeholder="Payment Method"
                data={[
                  {value: 'PAYNOW', label: 'Pay with Card'},
                  {value: 'LC', label: 'Letter of Credit'},
                  {value: 'TRANSFER', label: 'Pay with Transfer'},
                  {
                    value: 'TT',
                    label: 'Pay with Telegramic Transfer',
                  },
                ]}
                onChange={value => {
                  setSelectedPaymentMethod(value?.value);
                  // setCurrency("");
                }}
              />

              {/*                 
              {(selectedPaymentMethod === "payNow" ||
                selectedPaymentMethod === "payWithCard" ||
                selectedPaymentMethod === "payWithTransfer") && (
              
              )} */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setPaymentDetailsVisible(false);
                  // Perform save logic here if needed
                }}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.userDetailsContainer}>
          <Text style={styles.userDetailsTitle}>Notes</Text>
          <View style={styles.userInfoContainer}>
            {isNoteEditing ? ( // Display TextInput for editing when isNoteEditing is true
              <TextInput
                style={styles.userInfoInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add Note"
              />
            ) : (
              // Display text if not in editing mode
              <Text style={styles.userInfoText}>{note}</Text>
            )}
            {isNoteEditing ? ( // Show Save button when in editing mode
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleSaveNote}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              // Show Edit button when not in editing mode
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsNoteEditing(true)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {cart?.length === 0 ? null : (
          <View>
            <View
              style={{
                padding: 16,
                marginHorizontal: 16,
                marginTop: 8,
                backgroundColor: '#fff',
                borderRadius: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Bold',
                    fontSize: 16,
                    paddingVertical: 16,
                    paddingTop: 32,
                  }}>
                  Cart Summary
                </Text>
                <Text
                  style={{
                    fontFamily: 'Regular',
                    fontSize: 12,
                    paddingVertical: 16,
                    paddingTop: 32,
                    color: '#dc4d04',
                  }}
                  onPress={() => clearCart()}>
                  Clear Cart
                </Text>
              </View>
              <ScrollView>
                {cart.map(cartItem => (
                  <View
                    key={cartItem.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 16,
                      borderBottomWidth: 1,
                      borderTopWidth: 0.5,
                      borderColor: '#66666626',
                      paddingVertical: 16,
                    }}>
                    <Image
                      source={{uri: cartItem?.images}}
                      style={{
                        height: 100,
                        width: 100,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Regular',
                          fontSize: 14,
                        }}>
                        {cartItem.text}
                      </Text>

                      <Text
                        style={{
                          fontFamily: 'Bold',
                          fontSize: 16,
                          marginVertical: 16,
                        }}>
                        {currency === 'NGN'
                          ? `NGN ${(cartItem.quantity > 1
                              ? cartItem?.price *
                                cartItem.quantity *
                                NGNTODOLLAR
                              : cartItem?.price * NGNTODOLLAR
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : `USD ${
                              cartItem.quantity > 1
                                ? (
                                    cartItem?.price * cartItem.quantity
                                  ).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : cartItem?.price.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                            }`}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 24,
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 32,
                            marginTop: 16,
                            borderWidth: 1,
                            borderColor: '#66666655',
                            padding: 12,
                            paddingHorizontal: 18,
                            borderRadius: 12,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              increaseQuantity(String(cartItem.id))
                            }>
                            <Icon name="add-line" size={16} color="#66666675" />
                          </TouchableOpacity>
                          <Text>
                            <Text>{cartItem.quantity}</Text>
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              decreaseQuantity(String(cartItem.id))
                            }>
                            <Icon
                              name="subtract-line"
                              size={16}
                              color="#66666675"
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{marginTop: 16}}
                          onPress={() => removeFromCart(String(cartItem.id))}>
                          <Icon
                            name="delete-bin-line"
                            size={22}
                            color="#66666675"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.totalCostContainer}>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 16,
                  paddingVertical: 16,
                  paddingTop: 32,
                }}>
                Summary
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.totalCostLabel}>Total Item Cost</Text>
                <Text style={styles.totalCostValue}>
                  {currency} {roundedTotalItemCost?.toLocaleString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.totalCostLabel}>VAT</Text>
                <Text style={styles.totalCostValue}>
                  {currency} {roundedVAT?.toLocaleString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.totalCostLabel}>Total Item Cost</Text>
                <Text style={styles.totalCostValue}>
                  {currency} {calculateTotalCost()?.toLocaleString()}
                </Text>
              </View>

              <View>
                {submitErr ? (
                  <View
                    style={{
                      backgroundColor: '#ff000015',
                      padding: 16,
                      borderRadius: 8,
                      marginTop: 32,
                      marginBottom: -12,
                    }}>
                    <Text
                      style={{
                        color: '#ff0000',
                        fontFamily: 'Regular',
                      }}>
                      {submitErr}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#dc4d04',
                  marginVertical: 24,
                  borderRadius: 12,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleSignin}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Bold',
                    fontSize: 16,
                  }}>
                  Pay Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  totalCostContainer: {
    backgroundColor: '#Fff',
    margin: 16,
    borderRadius: 24,
    padding: 16,
  },
  totalCostLabel: {
    fontFamily: 'Regular',
    fontSize: 14,
  },
  totalCostValue: {
    fontFamily: 'Bold',
    fontSize: 16,
  },
  userDetailsContainer: {
    backgroundColor: '#Fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#666',
    borderRadius: 4,
    padding: 8,
    marginBottom: 24,
    height: 48,
  },
  userDetailsTitle: {
    fontSize: 18,
    fontFamily: 'Bold',
    paddingVertical: 12,
  },
  userInfoContainer: {
    marginVertical: 16,
    gap: 12,
  },
  userInfoItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  userInfoLabel: {
    fontFamily: 'Bold',
    marginVertical: 5,
    fontSize: 15,
  },
  userInfoText: {
    fontFamily: 'Regular',
    fontSize: 15,
  },
  userInfoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 48,
    marginTop: 6,
  },
  editButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc4d04',
    width: 120,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Medium',
    color: '#dc4d04',
  },
  saveButton: {
    backgroundColor: '#dc4d04',
    padding: 14,
    borderRadius: 12,
    width: 120,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Medium',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Bold',
    marginBottom: 16,
  },
  modalLabel: {
    fontFamily: 'Bold',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 48,
    marginBottom: 16,
  },
});
