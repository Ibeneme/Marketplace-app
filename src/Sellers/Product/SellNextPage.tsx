import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../Components/TextInput';
import Icon from 'react-native-remix-icon';
import CustomHeader from '../../Helpers/ProductHeaders';

interface SellProductFormNextProps {
  navigation: any; // Adjust type according to your navigation prop type
}

const SellProductFormNext: React.FC = () => {
  const navigation = useNavigation();
  const [specifications, setSpecifications] = useState<string[]>(['']);
  const [specificationsValue, setSpecificationsValue] = useState<string[]>([
    '',
  ]);

  const initialValues = {
    MinDeliveryDuration: '',
    maxDeliveryDuration: '',
    supplyCapacity: ' ',
    category: ' ',
    unit: '',
    price: '',
    currency: 'USD',
    specifications: [
      {
        specifications: specificationsValue,
      },
    ],
  };

  const sellProductSchema = Yup.object().shape({
    MinDeliveryDuration: Yup.string().required('Product name is required'),
    maxDeliveryDuration: Yup.string().required(
      'Product description is required',
    ),
    unit: Yup.string().required('Unit is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive'),
    currency: Yup.string().required('Currency is required'),
  });

  const handleAddSpecification = () => {
    setSpecifications([...specifications, '']);
  };

  const handleRemoveSpecification = (index: number) => {
    const newSpecifications = [...specifications];
    newSpecifications.splice(index, 1);
    setSpecifications(newSpecifications);
  };

  const handleSubmit = async (values: any) => {
    // Validate the form using Yup schema
    try {
      await sellProductSchema.validate(values, {abortEarly: false});
      // If validation passes, navigate to the next page with the form values
      navigation.navigate('NextPage', {values} as never);
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <Formik
          initialValues={initialValues}
          validationSchema={sellProductSchema}
          onSubmit={handleSubmit}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View style={{padding: 16, gap: 32}}>
              <CustomTextInput
                label="Product Name"
                value={values.MinDeliveryDuration}
                onChangeText={handleChange('MinDeliveryDuration')}
                onBlur={handleBlur('MinDeliveryDuration')}
                error={errors.MinDeliveryDuration}
                placeholder="Enter Product Name"
              />
              <CustomTextInput
                label="Product Description"
                value={values.maxDeliveryDuration}
                onChangeText={handleChange('maxDeliveryDuration')}
                onBlur={handleBlur('maxDeliveryDuration')}
                error={errors.maxDeliveryDuration}
                placeholder="Enter Product Description"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Unit</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholder="Select option"
                  data={[
                    {value: '', label: 'Select Categories'},
                    {value: 'pets', label: 'Pets'},
                    {value: 'agriculture', label: 'Agriculture'},
                    {value: 'Bags', label: 'Construction Materials'},
                    {value: 'Acres', label: 'Food and Beverages'},
                    {value: 'Yards', label: 'Apparel'},
                    {value: 'Dozen', label: 'Home and Furniture'},
                    {value: 'Bags', label: 'Beauty and Personal Care'},
                    {value: 'Acres', label: 'Packaging anf Supplies'},
                    {value: 'Yards', label: 'Minerals and Metalurgy'},
                  ]}
                  labelField="label"
                  valueField="value"
                  value={values.unit}
                  maxHeight={800}
                  onChange={item => {
                    console.log(item?.value);
                    handleChange('unit')(item?.value);
                  }}
                />

                {errors.unit && <Text style={styles.error}>{errors.unit}</Text>}
              </View>
              <CustomTextInput
                label="Price"
                value={values.price}
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                error={errors.price}
                keyboardType="numeric"
                placeholder="Enter Price"
              />
              <View style={styles.inputContainer}>
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
              <View style={{gap: -24}}>
                <Text style={styles.specLabel}>Product Specifications</Text>
                {specifications.map((spec, index) => (
                  <View key={index} style={styles.specContainer}>
                    <View style={{width: '85%', flexDirection: 'row', gap: 8}}>
                      <TextInput
                        placeholderTextColor={'#808080'}
                        style={[
                          styles.dropdown,
                          {
                            width: '50%',
                          },
                        ]}
                        value={spec}
                        onChangeText={(text: string) => {
                          const newSpecifications = [...specifications];
                          newSpecifications[index] = text;
                          setSpecifications(newSpecifications);
                        }}
                        placeholder={`Example Color`}
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
                        onChangeText={(text: string) => {
                          const newSpecifications = [...specificationsValue];
                          newSpecifications[index] = text;
                          setSpecificationsValue(newSpecifications);
                        }}
                        placeholder={`value e.g red, blue`}
                      />
                    </View>

                    {index !== 0 && ( // Render delete button only if index is not 0
                      <TouchableOpacity
                        onPress={() => handleRemoveSpecification(index)}
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
                        onPress={handleAddSpecification}
                        style={{
                          width: '15%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.removeBtn}>
                          <Icon name="add-circle-fill" size={24} color="#333" />
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
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
                onPress={() => handleSubmit()}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Bold',
                    fontSize: 16,
                  }}>
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

export default SellProductFormNext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  error: {
    color: 'red',
  },
  specLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 36,
  },
  specContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  removeBtn: {
    color: 'red',
    marginLeft: 8,
  },
  addBtn: {
    color: '#808080',
    // marginTop: 8,
  },
  dropdown: {
    marginBottom: 8,
    height: 45,
    padding: 12,
    borderColor: '#80808045',
    borderWidth: 0.6,
  },
});
