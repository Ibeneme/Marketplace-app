import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../Helpers/ProductHeaders';
import Icon from 'react-native-remix-icon';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {
  getAllRFG,
  getAllRFGMultiple,
  getAllRFGMultipleSeller,
  submitMultipleRFQResponse,
} from '../../../Redux/RFG/RFG';
import LoadingComponent from '../../Components/ShimmerLoader';
import {useCurrency} from '../../Helpers/CurrencyConverter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import CustomTextInput from '../../Components/TextInput';
import * as Yup from 'yup';
import {Formik, Field} from 'formik';
import {User} from './Profile';

export interface RequestData {
  price: string;
  unit: string;
  targetPrice: string;
  additionalNote: string;
  defaultRfqId: string;
  userId: string;
}

const logoImage = require('../../../assets/Tofa.png');

type Props = {};

export interface RFGS {
  createdAt: string;
  destinationPort: string;
  id: string;
  newFlag: boolean;
  paymentTerms: string;
  product: {
    productImages: string[];
  };
  productadditionalNote: string;
  productId: string;
  productName: string;
  quantityRequired: string;
  sellerId: string;
  status: string;
  supplierResponse: {
    additionalNote: string;
  };
  targetPrice: string;
  termsOfTrade: string;
  countryOfOrigin: string;
  unit: string;
  updatedAt: string;
  user: {
    LastName: string;
    email: string;
    firstName: string;
    id: string;
    isEmailVerified: boolean;
    isEnabled: boolean;
  };
  userId: string;
  cost: string;
}

const RfgMultiple = (props: Props) => {
  const [rfgs, setRfgs] = useState<RFGS[]>([]);
  const [selectedRFG, setSelectedRFG] = useState<RFGS | null>(null); // State to hold the selected RFG
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All'); // State to hold filter status
  const [userID, setUserID] = useState<User | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [seller, setSeller] = useState(false);
  const [accessTokenExists, setAccessTokenExists] = useState<boolean>(false);
  const validationSchema = Yup.object().shape({
    price: Yup.number().required('Price is required'),
    additionalNote: Yup.string().required('Additional Note is required'),
  });

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
                  dispatch(getAllRFGMultipleSeller())
                    .then(response => {
                      setLoading(false);
                      console.log(response?.payload, 'ggg');
                      const rfqs = response?.payload?.data;
                      if (rfqs) {
                        const sortedRfgs = [...rfqs].sort(
                          (a: RFGS, b: RFGS) => {
                            return (
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                            );
                          },
                        );
                        setRfgs(sortedRfgs);
                        console.log(sortedRfgs, 'jjj');
                      } else {
                        //console.error("No RFQs found in the response.");
                      }
                    })
                    .catch(error => {
                      setLoading(false);
                      //console.error("Error fetching rfgs:", error);
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

  const fetchRfqs = () => {
    setLoading(true);
    if (seller) {
      dispatch(getAllRFGMultipleSeller())
        .then(response => {
          setLoading(false);
          const rfqs = response?.payload?.data?.rfqs;
          if (rfqs) {
            const sortedRfgs = [...rfqs].sort((a: RFGS, b: RFGS) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
            setRfgs(sortedRfgs);
            console.log(sortedRfgs, 'jjj');
          } else {
            //console.error("No RFQs found in the response.");
          }
        })
        .catch(error => {
          setLoading(false);
          //console.error("Error fetching rfgs:", error);
        });
    } else {
      dispatch(getAllRFGMultiple())
        .then(response => {
          setLoading(false);
          const rfqs = response?.payload?.data?.rfqs;
          if (rfqs) {
            const sortedRfgs = [...rfqs].sort((a: RFGS, b: RFGS) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
            setRfgs(sortedRfgs);
            console.log(sortedRfgs, 'jjj');
          } else {
            //console.error("No RFQs found in the response.");
          }
        })
        .catch(error => {
          setLoading(false);
          //console.error("Error fetching rfgs:", error);
        });
    }
  };

  useEffect(() => {
    fetchRfqs();
    checkToken();
  }, []);

  const filterRFQsByStatus = (status: string) => {
    if (!rfgs || !Array.isArray(rfgs)) {
      return [];
    }

    if (status === 'All') {
      return rfgs;
    } else {
      return rfgs.filter(rfq => rfq.status === status);
    }
  };

  // Handler for toggling filter status
  const handleToggleFilter = (status: string) => {
    setFilterStatus(status);
  };
  const handleModal = (rfg: RFGS) => {
    setSelectedRFG(rfg);
    setModalVisible(true);
  };

  const parseDate = (dateString: string): Date => {
    const parts: number[] = dateString.split(/[-T:]/).map(parseFloat);
    const [year, month, day, hour, minute, second] = parts;
    return new Date(year, month - 1, day, hour, minute, second);
  };

  interface GroupedRFQs {
    [key: string]: RFGS[];
  }

  const groupRFQsByDate = (rfqs: RFGS[]): {date: string; rfqs: RFGS[]}[] => {
    const groupedRFQs: GroupedRFQs = {};
    rfqs.forEach((rfq: RFGS) => {
      const createdAtDate = parseDate(rfq.createdAt);
      if (!isNaN(createdAtDate.getTime())) {
        const date = createdAtDate.toISOString().split('T')[0];
        if (groupedRFQs[date]) {
          groupedRFQs[date].push(rfq);
        } else {
          groupedRFQs[date] = [rfq];
        }
      } else {
        //console.error(`Invalid date: ${rfq.createdAt}`);
      }
    });
    return Object.entries(groupedRFQs).map(([date, rfqs]) => ({
      date,
      rfqs,
    }));
  };

  const {showInUSD} = useCurrency();

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Multiple RFQs" />
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : (
        <View
          style={{
            backgroundColor: '#f4f4f4',
            minHeight: '100%',
            paddingBottom: 230,
          }}>
          <View style={styles.toggleContainer}>
            <Text
              style={[
                styles.toggleText,
                filterStatus === 'All' && styles.activeToggleText,
              ]}
              onPress={() => handleToggleFilter('All')}>
              All RFQs
            </Text>
            <Text
              style={[
                styles.toggleText,
                filterStatus === 'AWAITING_RESPONSE' && styles.activeToggleText,
              ]}
              onPress={() => handleToggleFilter('AWAITING_RESPONSE')}>
              Awaiting RFQs
            </Text>
            <Text
              style={[
                styles.toggleText,
                filterStatus === 'RESPONDED' && styles.activeToggleText,
              ]}
              onPress={() => handleToggleFilter('RESPONDED')}>
              Received RFQs
            </Text>
          </View>

          {rfgs.length === 0 ? ( // Conditionally render when no RFQs are found
            <View style={styles.noRFGsContainer}>
              <Icon name="file-list-line" size={50} color="#ccc" />
              <Text style={styles.noRFGsText}>No Multiple RFGs found</Text>
            </View>
          ) : (
            <View
            //style={{ flex: 1 }}
            >
              <FlatList
                data={groupRFQsByDate(filterRFQsByStatus(filterStatus))}
                renderItem={({item}) => (
                  <>
                    <Text
                      style={{
                        color: '#808080',
                        fontFamily: 'SemiBold',
                        marginBottom: 12,
                        marginTop: 24,
                        textAlign: 'right',
                        paddingRight: 16,
                      }}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    {item.rfqs.map((rfq: RFGS, index: any) => (
                      <TouchableOpacity
                        style={{paddingHorizontal: 16, marginBottom: -4}}
                        key={rfq.id}
                        onPress={() => handleModal(rfq)}>
                        <View style={styles.quoteCard}>
                          <View
                            style={{
                              backgroundColor: '#dc4d0415',
                              padding: 16,
                              height: 72,
                              width: 72,
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 8,
                            }}>
                            <Icon
                              name="file-list-3-fill"
                              size={24}
                              color="#dc4d04"
                            />
                          </View>
                          <View>
                            <Text style={styles.quoteCardTitle}>
                              {rfq.productName}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'SemiBold',
                                fontSize: 14,
                                marginBottom: 4,
                              }}>
                              {showInUSD
                                ? `NGN ${(
                                    parseFloat(rfq?.targetPrice) * 1400
                                  ).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}`
                                : `USD ${parseFloat(
                                    rfq?.targetPrice,
                                  ).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}`}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'Regular',
                                fontSize: 14,
                              }}>
                              Qty: {rfq.quantityRequired}
                            </Text>
                            {/* <Text>
                Date Created:{" "}
                {new Date(rfq.createdAt).toLocaleDateString()}
              </Text> */}
                            {rfq?.supplierResponse ? (
                              <Text
                                style={{
                                  fontFamily: 'Regular',
                                  fontSize: 14,
                                  marginBottom: 4,
                                  marginTop: 6,
                                  textDecorationLine: 'underline',
                                  color: '#dc4d04',
                                }}
                                numberOfLines={2} // Limiting to 2 lines
                                ellipsizeMode="tail" // Truncate with ellipsis if exceeds 2 lines
                              >
                                View Suppliers Reply
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
                keyExtractor={item => item.date}
              />
            </View>
          )}

          <Modal visible={isModalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              {selectedRFG ? (
                <View style={styles.modalContent}>
                  <ScrollView>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#66666635',
                      }}>
                      <Text style={styles.quoteCardTitleModal}>
                        {selectedRFG?.productName}
                      </Text>
                      <Icon
                        name="close-line"
                        size={24}
                        color="#000"
                        onPress={() => {
                          setModalVisible(false);
                          setResponseMessage(null);
                        }}
                      />
                    </View>
                    <View style={{marginVertical: 16, gap: 24}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 4,
                        }}>
                        <Text style={{fontFamily: 'Bold'}}>Quantity: </Text>
                        <Text>{selectedRFG.quantityRequired}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 4,
                        }}>
                        <Text style={{fontFamily: 'Bold'}}>Target Price: </Text>
                        <Text>USD{selectedRFG.targetPrice}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 4,
                        }}>
                        <Text style={{fontFamily: 'Bold'}}>Payment Term: </Text>
                        <Text>{selectedRFG.paymentTerms}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 4,
                        }}>
                        <Text style={{fontFamily: 'Bold'}}>
                          Shipping Term:{' '}
                        </Text>
                        <Text>{selectedRFG.termsOfTrade}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 4,
                        }}>
                        <Text style={{fontFamily: 'Bold'}}>Date Created: </Text>
                        <Text>
                          {' '}
                          {new Date(selectedRFG.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: 4,
                        }}>
                        <Text style={{fontFamily: 'Bold'}}>Requirements: </Text>
                        <Text>{selectedRFG.productadditionalNote}</Text>
                      </View>
                      {selectedRFG?.supplierResponse?.additionalNote ? (
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 12,
                            backgroundColor: '#dc4d0415',
                            padding: 16,
                            borderRadius: 4,
                          }}>
                          <Text style={{fontFamily: 'Bold', color: '#dc4d04'}}>
                            Suppliers Response
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Regular',
                              color: '#dc4d04',
                              fontSize: 14,
                            }}>
                            {selectedRFG?.supplierResponse?.additionalNote}
                          </Text>
                        </View>
                      ) : null}

                      <View>
                        <Formik
                          initialValues={{price: '', additionalNote: ''}}
                          validationSchema={validationSchema}
                          onSubmit={(values, {resetForm}) => {
                            console.log('Form values:', values);
                            const targetPriceNumbers = (
                              selectedRFG?.targetPrice || ''
                            ).replace(/\D/g, '');
                            const requestData: RequestData = {
                              price: values.price,
                              unit: selectedRFG?.quantityRequired || '',
                              targetPrice: targetPriceNumbers,
                              additionalNote: values.additionalNote,
                              defaultRfqId: selectedRFG?.id || '',
                              userId: userID?.id || '',
                            };
                            dispatch(submitMultipleRFQResponse(requestData))
                              .then((response: any) => {
                                console.log('Response:', response);
                                if (response.payload.message === 'success') {
                                  // Set the response message
                                  setResponseMessage(
                                    'Response submitted successfully!',
                                  );
                                } else {
                                  setResponseMessage(
                                    'Response submission failed.',
                                  );
                                }
                              })
                              .catch((error: any) => {
                                console.log('Error:', error);
                                setResponseMessage(
                                  'Response submission failed.',
                                );
                              });
                            resetForm();
                          }}>
                          {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            isValid, // Add isValid property from Formik
                          }) => (
                            <View>
                              <Field
                                component={CustomTextInput}
                                label="Price"
                                value={values.price}
                                onChangeText={handleChange('price')}
                                onBlur={handleBlur('price')}
                                error={touched.price && errors.price}
                                keyboardType="numeric"
                                placeholder="Enter Price"
                              />

                              <Field
                                component={CustomTextInput}
                                label="Additional Note"
                                placeholder="Enter Additional Note"
                                value={values.additionalNote}
                                onChangeText={handleChange('additionalNote')}
                                onBlur={handleBlur('additionalNote')}
                                error={
                                  touched.additionalNote &&
                                  errors.additionalNote
                                }
                                multiline
                                numberOfLines={4}
                              />

                              {responseMessage && (
                                <Text
                                  style={{
                                    color: responseMessage.includes('success')
                                      ? 'green'
                                      : 'red',
                                    marginTop: 10,
                                  }}>
                                  {responseMessage}
                                </Text>
                              )}

                              <TouchableOpacity
                                onPress={() => handleSubmit()}
                                disabled={!isValid} // Disable button if form is not valid
                                style={{
                                  backgroundColor: !isValid
                                    ? '#ccc'
                                    : '#dc4d04', // Change button color based on validity
                                  padding: 10,
                                  borderRadius: 5,
                                  alignItems: 'center',
                                  marginTop: 10,
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontFamily: 'Regular',
                                  }}>
                                  Submit
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </Formik>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              ) : null}
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  toggleText: {
    fontSize: 16,
    color: '#555',
    padding: 8,
    marginRight: 12,
    textDecorationLine: 'none',
    fontFamily: 'Regular',
  },
  activeToggleText: {
    color: '#dc4d04',
  },
  noRFGsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noRFGsText: {
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Regular',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    width: '100%',
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#66666635',
  },
  quoteCardTitleModal: {
    paddingVertical: 16,
    fontFamily: 'Bold',
    fontSize: 18,
  },
  quoteCardTitle: {
    fontFamily: 'Bold',
    fontSize: 16,
    paddingVertical: 6,
  },
  quoteCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 12,
  },
});

export default RfgMultiple;
