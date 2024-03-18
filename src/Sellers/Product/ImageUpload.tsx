// import {useRoute} from '@react-navigation/native';
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   SafeAreaView,
// } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import CustomHeader from '../../Helpers/ProductHeaders';

// const ImageUpload = () => {
//   const route = useRoute(); // Destructure mergedValues from route params
// const {mergedValues} = route.params;
// {
//   console.log(mergedValues, 'mergedValuesmergedValues');
// }
// Destructure specific values from mergedValues
//const {productSpecification, subCategoryId} = mergedValues;
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ImagePickerResponse,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-remix-icon';
import CustomHeader from '../../Helpers/ProductHeaders';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {sellProduct} from '../../../Redux/Product/Sellers';

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagessend, setSelectedImagessend] = useState([]);

  const route = useRoute(); // Destructure mergedValues from route params
  const {mergedValues} = route.params;
  {
    console.log(mergedValues, 'mergedValues');
  }

  // const {productSpecification, subCategoryId} = formData;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();

  const handleSubmit = () => {
    // Create a FormData object
    const formData = new FormData();
  
    setLoading(true);


    // Append key-value pairs from mergedValues object
    formData.append('countryOfOrigin', mergedValues.countryOfOrigin);
    formData.append('currency', mergedValues.currency);
    formData.append('maxDuration', mergedValues.maxDuration);
    formData.append('maxPricePerUnit', mergedValues.maxPricePerUnit);
    formData.append('minDuration', mergedValues.minDuration);
    formData.append('minOrdersAllowed', mergedValues.minOrdersAllowed);
    formData.append('minPricePerUnit', mergedValues.minPricePerUnit);
    formData.append('productDescription', mergedValues.productDescription);
    formData.append('productName', mergedValues.productName);
    formData.append(
      'specification',
      JSON.stringify(mergedValues.specification),
    );
    formData.append('categoryIds', mergedValues.subCategoryId);
    formData.append('supplyCapacity', mergedValues.supplyCapacity);
    formData.append('unitForMinOrder', mergedValues.unitForMinOrder);
    formData.append(
      'unitForSupplyCapacity',
      mergedValues.unitForSupplyCapacity,
    );
    formData.append('userId', mergedValues.userId);
    formData.append('featuredImage', selectedImagessend);

    // Dispatch FormData object
    console.log(formData, 'mergedValuesformData')
    dispatch(sellProduct(formData))
      .then((response: any) => {
        setLoading(false);
        console.log(response.payload);
        const errorMessage = response.payload.errors[0].message;
        Alert.alert(`${errorMessage}`);
      })
      .catch((error: any) => {
        setLoading(false);
        // Handle errors
      });
  };

  const handleImageUpload = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      allowsEditing: true,
      selectionLimit: 5, // Adjust the selection limit as per your requirement
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const images = response?.assets?.map(image => ({
          uri: image.uri,
          size: image.fileSize,
        }));

        const validImages = images.filter(
          image => image.size <= 5 * 1024 * 1024,
        );
        if (validImages.length < images.length) {
          Alert.alert('Some images exceed the 5MB size limit.');
        }

        setSelectedImages(prevImages => [...prevImages, ...validImages]);
        // Extracting URLs of selected images and storing them in an array
        const selectedImageUrls = validImages.map(image => image.uri);
        console.log('Selected Image URLs:', selectedImageUrls);
        setSelectedImagessend(selectedImageUrls)
      }
    });
  };

  const handleDeleteImage = indexToRemove => {
    setSelectedImages(prevImages =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <View
          style={{
            marginHorizontal: 16,
            marginVertical: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: '#fff',
            borderRadius: 12,
          }}>
          <TouchableOpacity
            onPress={handleImageUpload}
            style={{
              borderColor: '#80808045',
              borderWidth: 1,
              height: 150,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="upload-cloud-line" size={24} color="#808080" />

            <Text style={styles.buttonText}>Click to Add Photos</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: selectedImages?.length > 0 ? '#fff' : '#f4f4f4',
            borderRadius: 12,
          }}>
          {selectedImages.map((image, index) => (
            <View>
              <View key={index} style={styles.imageWrapper}>
                <View>
                  <Image
                    source={{uri: image.uri}}
                    style={styles.image}
                    onError={error =>
                      console.log('Image loading error:', error)
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteImage(index)}
                    style={styles.deleteButton}>
                    <Icon name="delete-bin-6-line" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {selectedImages?.length > 0 ? (
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
                {loading ? <ActivityIndicator color="#fff" /> : 'Submit'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  button: {
    backgroundColor: '#dc4d04',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 32,
  },
  buttonText: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
  },
  imageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
  },
  imageWrapper: {
    marginBottom: 10,
    width: '100%',
    position: 'relative', // Add position: 'relative'
  },
  image: {
    minHeight: '50%',
    width: '100%',
    borderRadius: 12,
    aspectRatio: 1,
    // marginBottom: 24,
  },
  deleteButton: {
    backgroundColor: '#dc4d04',
    borderRadius: 343,
    padding: 12,
    alignItems: 'center',
    position: 'absolute', // Add position: 'absolute'
    top: 5, // Adjust as needed for the top spacing
    right: 5, // Adjust as needed for the right spacing
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
