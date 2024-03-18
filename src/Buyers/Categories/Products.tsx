import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Product } from '../Products/AllProducts';
import CustomHeader from '../../Helpers/ProductHeaders';
import { useRoute } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../../../Routing/Buyers/BuyersStack';
import { useCurrency } from '../../Helpers/CurrencyConverter';


interface Category {
  id: string;
  category: string;
  image?: string;
  products: Product[];
}

interface ProductPageProps {}

type ProductPageRouteProp = RouteProp<StackParamList, 'ProductPage'>;
type ProductPageNavigationProp = StackNavigationProp<
  StackParamList,
  'ProductPage'
>;

type ProductPagePropsWithNavigation = {
  route: ProductPageRouteProp;
  navigation: ProductPageNavigationProp;
};

const ProductPage: React.FC<ProductPagePropsWithNavigation> = ({
  route,
  navigation,
}) => {
  const { categoryData } = route.params as { categoryData: Category };
  const { showInUSD } = useCurrency();

  const handleProductPress = (product: Product) => () => {
    navigation.navigate('ProductDetails', { productData: product });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={categoryData?.category} />
      <ScrollView contentContainerStyle={styles.containers}>
        {categoryData?.products?.length === 0 ? (
          <View style={styles.noItemsContainer}>
            <Text>No items found</Text>
          </View>
        ) : (
          categoryData?.products?.map((product) => (
            <TouchableOpacity
              onPress={handleProductPress(product)}
              key={product?.id}
              style={styles.productContainer}>
              <Image
                source={{
                  uri: Array.isArray(product?.productImages)
                    ? product?.productImages[0].image
                    : product?.productImages || 'defaultImageURL',
                }}
                style={styles.productImage}
              />
              <Text style={styles.productTitle}>{product?.productName}</Text>
              <Text style={styles.productPrice}>
                {showInUSD
                  ? `NGN ${(
                      parseFloat(product?.minPricePerUnit) * 1400
                    ).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : `USD ${parseFloat(product?.minPricePerUnit).toLocaleString(
                      'en-US',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}`}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#Ffffff',
    flex: 1,
  },
  containers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    flexWrap: 'wrap',
  },
  noItemsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  productContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    marginTop: 4,
    color: '#666666',
  },
});

export default ProductPage;
