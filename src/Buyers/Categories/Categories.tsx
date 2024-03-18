import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {RootState} from '../../../Redux/store';
import {getAllCategory} from '../../../Redux/Product/Product';
import {Product} from '../Products/AllProducts';
import LoadingComponent from '../../Components/ShimmerLoader';
const logoImage = require('../../../assets/Tofa.png');

export type Category = {
  id: string;
  category: string;
  image?: string;
  products: Product[];
  children: Product[];
};

interface CategoriesProps {}

const Categories: React.FC<CategoriesProps> = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [categoriesLoaded, setCategoriesLoaded] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllCategory())
      .then(response => {
        console.log(
          response?.payload?.data?.categories,
          'item?.children?.children?.length',
        );
        setCategoriesLoaded(response?.payload?.data?.categories);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        //console.error("Error:", error);
      });
  }, [dispatch]);

  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const renderItem = ({item}: {item: Category}) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryContainer}
      onPress={() => {
        console.log(item?.id);
        navigation.navigate('SubCategories', {
          categoryData: item?.children,
        });
      }}>
      {item.image ? (
        <Image source={{uri: item.image}} style={styles.categoryImage} />
      ) : (
        <View style={styles.categoryImage} />
      )}
      <View style={{alignItems: 'flex-start', gap: 6}}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        <Text
          style={styles.itemCount}>{`(${item?.children?.length} items)`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={categoriesLoaded}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
    margin: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 6,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Bold',
    textAlign: 'center',
  },
  itemCount: {
    color: '#666666',
    fontFamily: 'Regular',
  },
});

export default Categories;
