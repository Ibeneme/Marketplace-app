import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Dropdown} from 'react-native-element-dropdown';
import CustomTextInput from '../../Components/TextInput';
import Icon from 'react-native-remix-icon';
import CustomHeader from '../../Helpers/ProductHeaders';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {getAllCategory} from '../../../Redux/Product/Product';

const SellProductForm: React.FC = () => {
  const sellProductSchema = Yup.object().shape({
    productName: Yup.string().required('Product name is required'),
    minPricePerUnit: Yup.number()
      .required('Minimum price per unit is required')
      .positive('Price must be positive'),
    maxPricePerUnit: Yup.number()
      .required('Maximum price per unit is required')
      .positive('Price must be positive'),
    currency: Yup.string().required('Currency is required'),
   /// noMinOrder: Yup.boolean(),
    minOrdersAllowed: Yup.string().required(
      'Unit for minimum order is required',
    ),
    unitForMinOrder: Yup.string().required(
      'Unit for minimum order is required',
    ),
    unitForSupplyCapacity: Yup.string().required('Unit  is required'),
    supplyCapacity: Yup.string().required('Supply capacity is required'),
    countryOfOrigin: Yup.string().required('Country of origin is required'),
    minDuration: Yup.string().required('Minimum duration is required'),
    maxDuration: Yup.string().required('Maximum duration is required'),
    productDescription: Yup.string().required('Product Descriptionis required'),
  });

  const [categoryLabel, setCategoryLabel] = useState([]);
  const [categoryID, setCategoryID] = useState('');
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();

  useEffect(() => {
    dispatch(getAllCategory())
      .then(response => {
        console.log('Categories fetched successfully:', response);
        setCategoryLabel(response);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []); // Empty dependency array indicates that useEffect should run only once

  const initialValues = {
    productName: '',
    minPricePerUnit: '',
    maxPricePerUnit: '',
    currency: '',
   // noMinOrder: false,
    minOrdersAllowed: '',
    unitForMinOrder: '',
    supplyCapacity: '',
    countryOfOrigin: '',
    minDuration: '',
    maxDuration: '',
    unitForSupplyCapacity: '',
  };
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <Formik
          initialValues={initialValues}
          validationSchema={sellProductSchema}
          onSubmit={values => {
            console.log(values);
            navigation.navigate('ProductSpecification', {prevValues: values});
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue,
          }) => (
            <View style={{padding: 16, gap: 32}}>
              <CustomTextInput
                label="Product Name"
                value={values.productName}
                onChangeText={handleChange('productName')}
                onBlur={handleBlur('productName')}
                error={errors.productName}
                placeholder="Enter Product Name"
              />
              <CustomTextInput
                label="Minimum Price Per Unit"
                value={values.minPricePerUnit}
                onChangeText={handleChange('minPricePerUnit')}
                onBlur={handleBlur('minPricePerUnit')}
                error={errors.minPricePerUnit}
                keyboardType="numeric"
                placeholder="Enter Minimum Price Per Unit"
              />
              <CustomTextInput
                label="Maximum Price Per Unit"
                value={values.maxPricePerUnit}
                onChangeText={handleChange('maxPricePerUnit')}
                onBlur={handleBlur('maxPricePerUnit')}
                error={errors.maxPricePerUnit}
                keyboardType="numeric"
                placeholder="Enter Maximum Price Per Unit"
              />
              <View
                style={[
                  styles.inputContainer,
                  {
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text style={styles.label}>Currency</Text>

                <Dropdown
                  style={styles.dropdown}
                  placeholder="Select option"
                  data={[
                    {label: 'Select Currency', value: ''},
                    {label: 'USD', value: 'USD'},
                    {label: 'EUR', value: 'EUR'},
                    {label: 'NGN', value: 'NGN'},
                    {label: 'GHS', value: 'GHS'},
                    {label: 'GBP', value: 'GBP'},
                  ]}
                  labelField="label"
                  valueField="value"
                  value={values.currency}
                  maxHeight={800}
                  onChange={item => {
                    console.log(item?.value);
                    handleChange('currency')(item?.value);
                  }}
                />

                {errors.currency && (
                  <Text style={styles.error}>{errors.currency}</Text>
                )}
              </View>

              {/* <View
                style={[
                  styles.inputContainer,
                  {
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text style={styles.label}>No Minimum Orders</Text>

                <Dropdown
                  style={styles.dropdown}
                  placeholder="Select Option"
                  data={[
                    {label: 'Select Option', value: ''},
                    {label: 'True', value: 'True'},
                    {label: 'False', value: 'False'},
                  ]}
                  labelField="label"
                  valueField="value"
                  value={values.noMinOrder}
                  maxHeight={800}
                  onChange={item => {
                    console.log(item?.value);
                    handleChange('noMinOrder')(item?.value);
                  }}
                />

                {errors.noMinOrder && (
                  <Text style={styles.error}>{errors.noMinOrder}</Text>
                )}
              </View> */}

              <View
                style={[
                  styles.inputContainer,
                  {
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text style={styles.label}>Unit for Minimum Order</Text>

                <Dropdown
                  style={styles.dropdown}
                  placeholder="Select a Unit"
                  data={[
                    {value: '', label: 'Select Categories'},
                    {value: 'Dozen', label: 'Dozen'},
                    {value: 'Bags', label: 'Bags'},
                    {value: 'Acres', label: 'Acres'},
                    {value: 'Yards', label: 'Yards'},
                  ]}
                  labelField="label"
                  valueField="value"
                  value={values.unitForMinOrder}
                  maxHeight={800}
                  onChange={item => {
                    console.log(item?.value);
                    handleChange('unitForMinOrder')(item?.value);
                  }}
                />

                {errors.unitForMinOrder && (
                  <Text style={styles.error}>{errors.unitForMinOrder}</Text>
                )}
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text style={styles.label}>Unit for Supply Capacity</Text>

                <Dropdown
                  style={styles.dropdown}
                  placeholder="Select a Unit"
                  data={[
                    {value: '', label: 'Select Categories'},
                    {value: 'Dozen', label: 'Dozen'},
                    {value: 'Bags', label: 'Bags'},
                    {value: 'Acres', label: 'Acres'},
                    {value: 'Yards', label: 'Yards'},
                  ]}
                  labelField="label"
                  valueField="value"
                  value={values.unitForSupplyCapacity}
                  maxHeight={800}
                  onChange={item => {
                    console.log(item?.value);
                    handleChange('unitForSupplyCapacity')(item?.value);
                  }}
                />

                {errors.noMinOrder && (
                  <Text style={styles.error}>{errors.noMinOrder}</Text>
                )}
              </View>

              {/* <>
                <CustomTextInput
                  label="Minimum Orders Allowed"
                  value={values.minOrdersAllowed}
                  onChangeText={handleChange('minOrdersAllowed')}
                  onBlur={handleBlur('minOrdersAllowed')}
                  error={errors.minOrdersAllowed}
                  keyboardType="numeric"
                  placeholder="Enter Minimum Orders Allowed"
                />
                <CustomTextInput
                  label="Unit for Minimum Order"
                  value={values.unitForMinOrder}
                  onChangeText={handleChange('unitForMinOrder')}
                  onBlur={handleBlur('unitForMinOrder')}
                  error={errors.unitForMinOrder}
                  placeholder="Enter Unit for Minimum Order"
                />
              </> */}
              <>
                <CustomTextInput
                  label="Minimum Orders Allowed"
                  value={values.minOrdersAllowed}
                  onChangeText={handleChange('minOrdersAllowed')}
                  onBlur={handleBlur('minOrdersAllowed')}
                  error={errors.minOrdersAllowed}
                  keyboardType="numeric"
                  placeholder="Enter Minimum Orders Allowed"
                />
              </>

              <CustomTextInput
                label="Supply Capacity"
                value={values.supplyCapacity}
                onChangeText={handleChange('supplyCapacity')}
                onBlur={handleBlur('supplyCapacity')}
                error={errors.supplyCapacity}
                placeholder="Enter Supply Capacity"
              />

              <View
                style={[
                  styles.inputContainer,
                  {
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text style={styles.label}>Country Of Origin</Text>

                <Dropdown
                  style={styles.dropdown}
                  placeholder="Select option"
                  data={[
                    {label: 'Select Country', value: ''},
                    {label: 'Nigeria', value: 'Nigeria'},
                    {label: 'Ghana', value: 'Ghana'},
                    {label: 'Togo', value: 'Togo'},
                  ]}
                  labelField="label"
                  valueField="value"
                  value={values.countryOfOrigin}
                  maxHeight={800}
                  onChange={item => {
                    console.log(item?.value);
                    handleChange('countryOfOrigin')(item?.value);
                  }}
                />

                {errors.countryOfOrigin && (
                  <Text style={styles.error}>{errors.countryOfOrigin}</Text>
                )}
              </View>

              <CustomTextInput
                label="Minimum Duration"
                value={values.minDuration}
                onChangeText={handleChange('minDuration')}
                onBlur={handleBlur('minDuration')}
                error={errors.minDuration}
                placeholder="Enter Minimum Duration"
              />
              <CustomTextInput
                label="Maximum Duration"
                value={values.maxDuration}
                onChangeText={handleChange('maxDuration')}
                onBlur={handleBlur('maxDuration')}
                error={errors.maxDuration}
                placeholder="Enter Maximum Duration"
              />

              <CustomTextInput
                label="Product Description"
                value={values.productDescription}
                onChangeText={handleChange('productDescription')}
                onBlur={handleBlur('productDescription')}
                error={errors.minPricePerUnit}
                //keyboardType="numeric"
                placeholder="Enter Product Description"
                multiline
                height={150}
              />

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
                  style={{color: 'white', fontFamily: 'Bold', fontSize: 16}}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellProductForm;

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
});
