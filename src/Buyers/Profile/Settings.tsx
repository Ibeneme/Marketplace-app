import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import {Formik} from 'formik'; // Corrected import
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {
  fetchCurrentUser,
  updatePassword,
  updateProfileBuyer,
} from '../../../Redux/Auth/Auth';
import CustomHeader from '../../Helpers/ProductHeaders';
import {User} from './Profile';
import Icon from 'react-native-remix-icon';
import CustomTextInput from '../../Components/TextInput';
import LoadingComponent from '../../Components/ShimmerLoader';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsProps = {};

const Settings: React.FC<SettingsProps> = () => {
  const [updateProfile, setUpdateProfile] = useState(true);
  const [userID, setUserID] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [loadingPage, setLoadingPage] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();

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
                //console.log('Profile:', response?.payload?.currentUser?.role);
                if (response?.payload?.currentUser?.role === 'SELLER') {
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

  const handleFetchCurrentUser = () => {
    setLoadingPage(true);
    dispatch(fetchCurrentUser())
      .then((response: any) => {
        setLoadingPage(false);
        console.log(
          'Fetch current user successful:',
          response?.payload?.currentUser,
        );
        setUserID(response?.payload?.currentUser);
      })
      .catch((error: any) => {
        setLoadingPage(false);
        // console.error("Error fetching current user:", error);
      });
  };

  useEffect(() => {
    handleFetchCurrentUser();
  }, [dispatch]);

  const profileSchema = Yup.object().shape({
    businessName: Yup.string(),
    country: Yup.string(),
    address: Yup.string(),
  });

  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('New Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm New Password is required'),
  });

  const handleSaveChanges = (values: any) => {
    console.log('Changes saved!', values);
  };

  const handleUpdatePassword = (values: any) => {
    const {newPassword, confirmNewPassword} = values;
    if (newPassword !== confirmNewPassword) {
      setSuccess('Passwords do not match');
      return;
    }
    setLoading(true);
    dispatch(updatePassword(values))
      .then((response: any) => {
        setLoading(false);
        if (response?.payload?.message === 'success') {
          setSuccess('Password updated successfully');
        } else {
          setSuccess('Failed to update password');
        }
      })
      .catch((error: any) => {
        setLoading(false);
        setSuccess('Failed to update password');
        console.error('Error updating password:', error);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const logoImage = require('../../../assets/Tofa.png');

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CustomHeader />

        {loadingPage ? (
          <LoadingComponent logo={logoImage} />
        ) : (
          <ScrollView>
            <View style={{padding: 16, gap: 12}}>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    updateProfile ? styles.activeButton : null,
                  ]}
                  onPress={() => setUpdateProfile(true)}>
                  <Text
                    style={[
                      styles.toggleButtonText,
                      updateProfile ? styles.activeText : null,
                    ]}>
                    Update Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !updateProfile ? styles.activeButton : null,
                  ]}
                  onPress={() => setUpdateProfile(false)}>
                  <Text
                    style={[
                      styles.toggleButtonText,
                      !updateProfile ? styles.activeText : null,
                    ]}>
                    Update Password
                  </Text>
                </TouchableOpacity>
              </View>

              {updateProfile ? (
                <Formik
                  initialValues={{
                    firstName: '',
                    country: '',
                    businessName: '',
                    businessType: '',
                    businessDescription: '',
                    totalAnnualRevenue: '',
                    supplyCapacity: '',
                    address: '',
                    yearEstablished: '',
                  }}
                  validationSchema={profileSchema}
                  onSubmit={(values, {resetForm}) => {
                    setSuccess(''); // Resetting success message
                    setLoading(true);
                    dispatch(updateProfileBuyer(values))
                      .then(response => {
                        setLoading(false);
                        console.log(
                          'Profile updated successfully:',
                          response?.payload?.message === 'success',
                        );
                        if (response?.payload?.message === 'success') {
                          resetForm();
                          handleFetchCurrentUser();
                          setSuccess('Profile update successfully'); // Set success to true if the update was successful
                        } else {
                          setSuccess('Failed to Update user profile'); // Set success to false if the update failed
                        }
                      })
                      .catch(error => {
                        setLoading(false);
                        setSuccess('Failed to Update user profile'); // Set success to false if the update failed
                        console.error('Error updating profile:', error);
                      });
                  }}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    isValid,
                  }) => (
                    <View>
                      {success ? (
                        <View
                          style={{
                            backgroundColor: '#dc4d0417',
                            padding: 12,
                            marginVertical: 36,
                            borderLeftWidth: 6,
                            borderLeftColor: '#dc4d04',
                          }}>
                          <Text
                            style={{
                              color: '#dc4d04',
                              fontFamily: 'Regular',
                            }}>
                            {success}
                          </Text>
                        </View>
                      ) : null}
                      <CustomTextInput
                        label="First Name"
                        placeholder="Enter your first name"
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                        error={errors.firstName}
                      />

                      <CustomTextInput
                        label="Country"
                        placeholder="Enter your country"
                        onChangeText={handleChange('country')}
                        onBlur={handleBlur('country')}
                        value={values.country}
                        error={errors.country}
                      />

                      <CustomTextInput
                        label="Business Name"
                        placeholder="Enter your business name"
                        onChangeText={handleChange('businessName')}
                        onBlur={handleBlur('businessName')}
                        value={values.businessName}
                        error={errors.businessName}
                      />
                      {seller === true ? (
                        <>
                          <CustomTextInput
                            label="Business Type"
                            placeholder="Enter your business type"
                            onChangeText={handleChange('businessType')}
                            onBlur={handleBlur('businessType')}
                            value={values.businessType}
                            error={errors.businessType}
                          />

                          <CustomTextInput
                            label="Business Description"
                            placeholder="Enter your business description"
                            onChangeText={handleChange('businessDescription')}
                            onBlur={handleBlur('businessDescription')}
                            value={values.businessDescription}
                            error={errors.businessDescription}
                          />

                          <CustomTextInput
                            label="Total Annual Revenue"
                            placeholder="Enter your total annual revenue"
                            onChangeText={handleChange('totalAnnualRevenue')}
                            onBlur={handleBlur('totalAnnualRevenue')}
                            value={values.totalAnnualRevenue}
                            error={errors.totalAnnualRevenue}
                          />

                          <CustomTextInput
                            label="Supply Capacity"
                            placeholder="Enter your supply capacity"
                            onChangeText={handleChange('supplyCapacity')}
                            onBlur={handleBlur('supplyCapacity')}
                            value={values.supplyCapacity}
                            error={errors.supplyCapacity}
                          />

                          <CustomTextInput
                            label="Address"
                            placeholder="Enter your address"
                            onChangeText={handleChange('address')}
                            onBlur={handleBlur('address')}
                            value={values.address}
                            error={errors.address}
                          />

                          <CustomTextInput
                            label="Year Established"
                            placeholder="Enter the year established"
                            onChangeText={handleChange('yearEstablished')}
                            onBlur={handleBlur('yearEstablished')}
                            value={values.yearEstablished}
                            error={errors.yearEstablished}
                          />
                        </>
                      ) : null}

                      {/* <View style={styles.inputContainer}>
                        <Text style={styles.label}>Business Name</Text>
                        <TextInput
                          style={styles.input}
                          placeholder={`${userID?.businessName}`}
                          value={values.businessName}
                          onChangeText={handleChange("businessName")}
                          onBlur={handleBlur("businessName")}
                        />
                        {errors.businessName && (
                          <Text style={styles.error}>
                            {errors.businessName}
                          </Text>
                        )}
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                          style={styles.input}
                          placeholder={`${userID?.country}`}
                          value={values.country}
                          onChangeText={handleChange("country")}
                          onBlur={handleBlur("country")}
                        />
                        {errors.country && (
                          <Text style={styles.error}>{errors.country}</Text>
                        )}
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                          style={styles.input}
                          placeholder={`${userID?.address}`}
                          value={values.address}
                          onChangeText={handleChange("address")}
                          onBlur={handleBlur("address")}
                        />
                        {errors.address && (
                          <Text style={styles.error}>{errors.address}</Text>
                        )}
                      </View>
                      <View> */}
                      {/* Input fields and error messages */}
                      <TouchableOpacity
                        onPress={() => {
                          handleSubmit();
                        }}
                        style={[
                          styles.saveButton,
                          {backgroundColor: '#dc4d04'},
                          !isValid && {opacity: 0.5},
                        ]}
                        disabled={!isValid}>
                        <Text style={styles.saveButtonText}>
                          {loading ? (
                            <ActivityIndicator size={16} color="#fff" />
                          ) : (
                            'Submit'
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={{newPassword: '', confirmNewPassword: ''}}
                  validationSchema={passwordSchema}
                  onSubmit={handleUpdatePassword}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    isValid,
                  }) => (
                    <>
                      <View style={styles.inputContainer}>
                        <View style={[{marginTop: 4}]}>
                          <CustomTextInput
                            label="New Password"
                            placeholder="Enter your password"
                            value={values.newPassword} // Changed to values.password
                            onChangeText={value => {
                              handleChange('newPassword')(value); // Changed to handleChange("password")(value)
                              // setErr(""); // Reset error message
                            }}
                            secureTextEntry={!showPassword}
                            error={errors.newPassword}
                          />
                          {/* Toggle button to show/hide password */}
                          <TouchableOpacity
                            style={styles.togglePasswordButton}
                            onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                              <Icon
                                name="eye-close-line"
                                size={24}
                                color="#333"
                              />
                            ) : (
                              <Icon name="ri-eye-fill" size={24} color="#333" />
                            )}
                          </TouchableOpacity>
                        </View>

                        <View style={[{marginTop: 4}]}>
                          <CustomTextInput
                            label="Confirm Password"
                            placeholder="Enter your password"
                            value={values.confirmNewPassword} // Changed to values.password
                            onChangeText={value => {
                              handleChange('confirmNewPassword')(value); // Changed to handleChange("password")(value)
                              // setErr(""); // Reset error message
                            }}
                            secureTextEntry={!showPassword}
                            error={errors.confirmNewPassword}
                          />
                          {/* Toggle button to show/hide password */}
                          <TouchableOpacity
                            style={styles.togglePasswordButton}
                            onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                              <Icon
                                name="eye-close-line"
                                size={24}
                                color="#333"
                              />
                            ) : (
                              <Icon name="ri-eye-fill" size={24} color="#333" />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.saveButton}>
                        <TouchableOpacity
                          onPress={() => handleSubmit()}
                          disabled={!isValid || loading}>
                          <View
                            style={[
                              styles.saveButton,
                              {backgroundColor: '#dc4d04'},
                              (!isValid || loading) && {opacity: 0.5},
                            ]}>
                            <Text style={styles.saveButtonText}>
                              {loading ? (
                                <ActivityIndicator size={16} color="#fff" />
                              ) : (
                                'Update Password'
                              )}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Formik>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Regular',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontFamily: 'Medium',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#dc4d04',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  togglePasswordButton: {
    position: 'absolute', // Position the button absolutely within the password input
    right: 16, // Adjust the position to the right side
    top: '43%', // Position in the middle vertically
    transform: [{translateY: -12}], // Adjust vertically to center the icon
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#dc4d0412',
    padding: 8,
    borderRadius: 8,
    height: 64,
    alignItems: 'center',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: 'Regular',
  },
  activeButton: {
    backgroundColor: '#dc4d04',
    padding: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeText: {
    color: '#fff',
  },
  error: {
    color: 'red',
    marginTop: -12,
    fontFamily: 'Regular',
    marginBottom: 24,
  },
});

export default Settings;
