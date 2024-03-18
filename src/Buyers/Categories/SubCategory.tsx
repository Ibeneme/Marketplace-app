import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {Product} from '../Products/AllProducts';
import LoadingComponent from '../../Components/ShimmerLoader';
import CustomHeader from '../../Helpers/ProductHeaders';
import {useNavigation, useRoute} from '@react-navigation/native'; // Import useRoute from react-navigation
export type Category = {
  id: string;
  category: string;
  image?: string;
  products: Product[];
  children: Product[];
};

interface SubCategoriesProps {}

const SubCategories: React.FC<SubCategoriesProps> = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const renderItem = ({item}: {item: Category}) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryContainer}
      onPress={() => {
        navigation.navigate('SubSubCategories', {
          categoryData: item.children,
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
          style={styles.itemCount}>{`(${item.children.length} items)`}</Text>
      </View>
    </TouchableOpacity>
  );

  // Check if categoryData is empty
  const route = useRoute();
  const {categoryData} = route.params as {categoryData: Category[]};

  if (categoryData.length === 0) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No items found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor: '#fff'}}>
        <CustomHeader />
      </View>
      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={categoryData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
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

export default SubCategories;
