import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {useNavigation, useRoute} from '@react-navigation/native'; // Import useRoute from react-navigation
import CustomTextInput from '../../Components/TextInput';
import CustomHeader from '../../Helpers/ProductHeaders';
import Icon from 'react-native-remix-icon';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {getAllCategory} from '../../../Redux/Product/Product';
import {Dropdown} from 'react-native-element-dropdown';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../../Buyers/Profile/Profile';

const ProductSpecification = () => {
  const [keyCount, setKeyCount] = useState(1);
  const route = useRoute();
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [categoryLabel, setCategoryLabel] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState('');

  useEffect(() => {
    checkToken();
    dispatch(getAllCategory())
      .then(response => {
        console.log('Categories fetched successfully:', response);
        setCategoryLabel(response?.payload?.data?.categories);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []); // Empty dependency array indicates that useEffect should run only once

  const handleCategorySelect = id => {
    console.log('Selected Category ID:', id);
    setSelectedCategoryID(id);
  };

  const getCategoryBackgroundColor = id => {
    return id === selectedCategoryID ? '#dc4d04' : 'transparent';
  };
  const getCategoryColor = id => {
    return id === selectedCategoryID ? '#FFFFFF' : '#333'; // White color for selected category
  };
  const handleAddPair = () => {
    setKeyCount(prevCount => prevCount + 1);
  };

  const handleRemovePair = () => {
    if (keyCount > 1) {
      setKeyCount(prevCount => prevCount - 1);
    }
  };

  const [userID, setUserID] = useState('');

  const checkToken = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      //setLoading(true);
      AsyncStorage.getItem('marketplace_access_token')
        .then(accessToken => {
          if (accessToken !== null) {
            dispatch(fetchCurrentUser())
              .then(response => {
                setUserID(response?.payload?.currentUser);
                const userID = response?.payload?.currentUser;
                console.log('Access Token:', accessToken);
              })
              .catch(error => {
                // console.error('Error while fetching current user:', error);
                //setLoading(false);
                reject(error);
              });
          } else {
            setAccessTokenExists(false);
            //setLoading(false);
            resolve();
          }
        })
        .catch(error => {
          //console.error('Error while checking token:', error);
          //setLoading(false);
          reject(error);
        });
    });
  };

  const navigation = useNavigation();
  const handleSubmit = values => {
    const submittedValues = {};
    for (let i = 1; i <= keyCount; i++) {
      if (values[`key${i}`] && values[`value${i}`]) {
        submittedValues[values[`key${i}`]] = values[`value${i}`];
      }
    }

    // Merge the submitted values with the previous values
    const mergedValues = {
      ...route.params.prevValues, // Previous values
      specification: submittedValues, // Submitted values
      subCategoryId: selectedCategoryID, // Adding selected category ID as subCategoryId
      userId: userID?.id,
    };

    console.log('Merged Values:', mergedValues);
    navigation.navigate('ImageUpload', {mergedValues});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <Formik
        initialValues={{key1: '', value1: '', categoryID: ''}}
        onSubmit={handleSubmit}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <SafeAreaView style={styles.container}>
            <CustomHeader />
            <View style={{padding: 16, paddingBottom: 120}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 20,
                    marginBottom: 48,
                  }}></Text>

                <View>
                  <Text
                    style={{fontWeight: '700', fontSize: 18, marginBottom: 16}}>
                    Enter your Product Specification
                  </Text>

                  {[...Array(keyCount)].map((_, index) => (
                    <View key={index} style={styles.specContainer}>
                      <View
                        style={{width: '85%', flexDirection: 'row', gap: 8}}>
                        <TextInput
                          placeholderTextColor={'#808080'}
                          style={[
                            styles.dropdown,
                            {
                              width: '50%',
                            },
                          ]}
                          onChangeText={handleChange(`key${index + 1}`)}
                          onBlur={handleBlur(`key${index + 1}`)}
                          value={values[`key${index + 1}`]}
                          placeholder="Enter key"
                        />
                        <TextInput
                          placeholderTextColor={'#808080'}
                          style={[
                            styles.dropdown,
                            {
                              width: '50%',
                            },
                          ]}
                          //value={spec}
                          onChangeText={handleChange(`value${index + 1}`)}
                          onBlur={handleBlur(`value${index + 1}`)}
                          value={values[`value${index + 1}`]}
                          placeholder={`value e.g red, blue`}
                        />
                      </View>

                      {index !== 0 && ( // Render delete button only if index is not 0
                        <TouchableOpacity
                          onPress={handleRemovePair}
                          style={{
                            width: '15%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.removeBtn}>
                            <Icon
                              name="delete-bin-4-line"
                              size={24}
                              color="#333"
                            />
                          </Text>
                        </TouchableOpacity>
                      )}
                      {index === 0 && ( // Render delete button only if index is not 0
                        <TouchableOpacity
                          onPress={() => handleAddPair()}
                          style={{
                            width: '15%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.removeBtn}>
                            <Icon
                              name="add-circle-fill"
                              size={24}
                              color="#333"
                            />
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>

                <View>
                  <Text
                    style={{
                      fontWeight: '700',
                      marginTop: 45,
                      fontSize: 18,
                      marginBottom: 16,
                    }}>
                    Choose a Category
                  </Text>
                  {categoryLabel.map(category => (
                    <TouchableOpacity
                      key={category?.id}
                      onPress={() => handleCategorySelect(category?.id)}
                      style={[
                        styles.categoryItem,
                        {
                          backgroundColor: getCategoryBackgroundColor(
                            category?.id,
                          ),
                          padding: 14,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderRadius: 12,
                        },
                      ]}>
                      <Text
                        style={{
                          marginBottom: 0,
                          color: getCategoryColor(category?.id),
                        }}>
                        {category?.category}
                      </Text>
                      {selectedCategoryID ? (
                        <Icon
                          name="checkbox-circle-fill"
                          size={24}
                          color="#fff"
                        />
                      ) : null}
                    </TouchableOpacity>
                  ))}
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
                  onPress={handleSubmit}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Bold',
                      fontSize: 16,
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ProductSpecification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
  dropdown: {
    marginBottom: 8,
    height: 45,
    padding: 12,
    borderColor: '#80808045',
    borderWidth: 0.6,
    width: '100%',
  },

  specLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 36,
  },
  specContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeBtn: {
    color: 'red',
    marginLeft: 8,
  },
  addBtn: {
    color: '#808080',
    // marginTop: 8,
  },
});
