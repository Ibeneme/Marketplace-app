import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {RootState} from '../../../Redux/store';
import {useDispatch} from 'react-redux';
import {getAllCategory, getAllProducts} from '../../../Redux/Product/Product';
import {ThunkDispatch} from '@reduxjs/toolkit';
import {Category} from '../Categories/Categories';
import {RFGS} from '../Profile/Rfg';
import {getAllRFG} from '../../../Redux/RFG/RFG';
import LoadingComponent from '../../Components/ShimmerLoader';
import {useCurrency} from '../../Helpers/CurrencyConverter';
export const logoImage = require('../../../assets/Tofa.png');

type ProductItemType = {
  seller?: string;
  images?: string[];
  price?: any;
  currency?: any;
  text?: any;
  qty?: string;
  image?: string;
  id?: number | string;
  onPress?: (id: string) => void;
};

export type Product = {
  id: any;
  productName: string;
  minPricePerUnit: any;
  maxPricePerUnit: any;
  currency: string;
  noMinOrder?: boolean;
  minOrdersAllowed?: string | null;
  unitForMinOrder?: string;
  supplyCapacity?: string;
  countryOfOrigin?: string;
  unitForSupplyCapacity?: string;
  minDuration?: string;
  maxDuration?: string;
  productSpecification?: {
    color?: string;
  };
  productDescription?: any;
  categoryId?: string;
  productVisibility?: string;
  productStatus?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  barcode?: string | null;
  productImages: {
    image: string;
    id: string;
  }[];
  RFQS?: any[];
  Category?: {
    id: string;
    category: string;
    image: string;
    icon: string;
    slug: string;
    description: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  createdBy?: {
    firstName: any;
    LastName: string;
    role: string;
    country: string;
    id: string;
    phoneNumber: string;
    email: string;
  };
};

const Card = ({
  title,
  image,
  onPress,
}: {
  title: string;
  image: any;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      <Image
        source={{
          uri: Array.isArray(image) ? image[0] : image || 'defaultImageURL',
        }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export const ProductCard = ({
  seller,
  images,
  text,
  price,
  currency,
  // qty,
  id,
  onPress,
}: ProductItemType) => (
  <TouchableOpacity onPress={() => onPress && onPress(String(id))}>
    <View style={styles.cardProduct}>
      <Image
        source={{
          uri: Array.isArray(images) ? images[0] : images || 'defaultImageURL',
        }}
        style={styles.cardImageProduct}
      />
      <View style={styles.cardProductView}>
        <Text style={styles.cardsellerProduct}>{seller}</Text>
        <Text style={styles.cardtextProduct}>{text}</Text>
        <View style={styles.currencyView}>
          <Text style={styles.cardpriceProduct}>{currency}</Text>
          <Text style={styles.cardcurrencyProduct}>{price}</Text>
          {/* <Text style={styles.cardpriceProduct}>/{qty}</Text> */}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const AllProducts: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState<Product[]>([]);
  const [categoryLoaded, setCategoryLoaded] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resultAction = await dispatch(
          getAllProducts({pageNumber: currentPage}),
        );
        if (getAllProducts.fulfilled.match(resultAction)) {
          dispatch(getAllCategory())
            .then(response => {
              setCategoryLoaded(response?.payload?.data?.categories);
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
              console.error('Error:', error);
            });

          const loadedProducts = resultAction?.payload?.map(
            (product: Product) => ({
              productName: product.productName,
              minPricePerUnit: product.minPricePerUnit,
              maxPricePerUnit: product.maxPricePerUnit,
              id: product.id,
              currency: product.currency,
              noMinOrder: product.noMinOrder || false,
              minOrdersAllowed: product.minOrdersAllowed || '',
              countryOfOrigin: product.countryOfOrigin || '',
              unitForMinOrder: product.unitForMinOrder || '',
              supplyCapacity: product.supplyCapacity || '',
              unitForSupplyCapacity: product.unitForSupplyCapacity || '',
              minDuration: product.minDuration || '',
              maxDuration: product.maxDuration || '',
              productSpecification: product.productSpecification || {},
              productDescription: product.productDescription || '',
              categoryId: product.categoryId || '',
              productVisibility: product.productVisibility || '',
              productStatus: product.productStatus || '',
              createdAt: product.createdAt || '',
              updatedAt: product.updatedAt || '',
              userId: product.userId || '',
              barcode: product.barcode || null,
              productImages: product.productImages || [],
              RFQS: product.RFQS || [],
              createdBy: product.createdBy || {
                firstName: '',
                LastName: '',
                role: '',
                country: '',
                id: '',
                phoneNumber: '',
                email: '',
              },
            }),
          );

          setProductsLoaded(loadedProducts);
        } else if (getAllProducts.rejected.match(resultAction)) {
          setLoading(false);
          console.error('Error fetching products:', resultAction.error);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error in fetchData:', error);
      }
    };
    fetchData();
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(getAllCategory())
      .then(response => {
        setCategoryLoaded(response?.payload?.data?.categories);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [dispatch]);

  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const scrollRef = useRef<ScrollView | null>(null);
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: 0, animated: true});
      ///setCurrentPage( currentPage -1)
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      setCurrentPage(currentPage + 1);
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleProductPress = (product: Product) => () => {
    navigation.navigate('ProductDetails', {productData: product});

    //navigation.navigate('PaymentScreen')
  };

  const handleCategoryPress = (category: Category) => {
    // navigation.navigate('ProductPage', {
    //   categoryData: category,
    // });
  };
  const [rfgs, setRfgs] = useState<RFGS[]>([]);
  const [selectedRFG, setSelectedRFG] = useState<RFGS | null>(null); // State to hold the selected RFG

  const fetchRfqs = () => {
    dispatch(getAllRFG())
      .then(response => {
        setRfgs(response?.payload?.data?.rfqs);
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const openModal = (rfg: RFGS) => {
    setSelectedRFG(rfg);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedRFG(null);
    setModalVisible(false);
  };

  console.log(loading, 'loading');

  const {ngnToUsd, usdToNgn} = useCurrency();

  const {toggleCurrency, showInUSD} = useCurrency();

  return (
    <>
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dqa2jr535/image/upload/v1707305065/new_thwhky.jpg',
              }}
              style={styles.image}
            />

            <View>
              <Text style={styles.texts}>Popular Categories</Text>
              <ScrollView horizontal>
                {categoryLoaded?.map((item: Category) => (
                  <Card
                    key={item.id}
                    onPress={() => {
                      console.log(item?.id);
                      navigation.navigate('SubCategories', {
                        categoryData: item?.children,
                      });
                    }}
                    title={item.category || ''}
                    image={item.image || ''}
                  />
                ))}
              </ScrollView>
            </View>
            <View>
              <View style={styles.header}>
                <View>
                  <Text style={styles.textsProducts}>Featured Products</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={scrollLeft}>
                    <Icon name="arrow-left-s-line" size={24} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={scrollRight}>
                    <Icon name="arrow-right-s-line" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView horizontal ref={scrollRef}>
                {productsLoaded?.map(item => (
                  <TouchableOpacity onPress={handleProductPress(item)}>
                    <ProductCard
                      key={item.id}
                      seller={item?.createdBy?.firstName}
                      images={[item?.productImages[0]?.image]}
                      price={
                        showInUSD
                          ? (
                              parseFloat(item.minPricePerUnit) * 1400
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : parseFloat(item.minPricePerUnit).toLocaleString(
                              'en-US',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )
                      }
                      currency={`${showInUSD ? 'NGN' : 'USD'}`}
                      text={item.productName}
                      onPress={handleProductPress(item)}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.quote}>
              <Text style={styles.texts}>Latest Request for Quote</Text>

              <ScrollView style={{flex: 1}}>
                {rfgs?.length > 0 ? (
                  rfgs?.map((rfg, index) => (
                    <TouchableOpacity
                      style={{paddingHorizontal: 0, marginBottom: 12}}
                      key={rfg.id}
                      onPress={() => openModal(rfg)}>
                      <View style={styles.quoteCard}>
                        <Text style={styles.quoteCardTitle}>
                          {rfg.productName}
                        </Text>

                        <Text>
                          {showInUSD
                            ? `NGN${(
                                parseFloat(rfg.targetPrice) * 1400
                              ).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : `USD${parseFloat(rfg.targetPrice).toLocaleString(
                                'en-US',
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}`}
                        </Text>
                        <Text>Quantity: {rfg.quantityRequired}</Text>
                        <Text>
                          Date Created:{' '}
                          {new Date(rfg.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>No RFGs found</Text>
                )}
              </ScrollView>
              <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                  {selectedRFG && (
                    <View style={styles.modalContent}>
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
                          onPress={closeModal}
                        />
                      </View>
                      <View style={{marginVertical: 16, gap: 24}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>Buyer</Text>
                          <Text>
                            {selectedRFG.user?.LastName}{' '}
                            {selectedRFG.user?.firstName}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>Quantity</Text>
                          <Text>{selectedRFG.quantityRequired}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>Target Price</Text>
                          <Text>
                            {showInUSD
                              ? `NGN${(
                                  parseFloat(selectedRFG.targetPrice) * 1400
                                ).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : `USD${parseFloat(
                                  selectedRFG.targetPrice,
                                ).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>Payment Term</Text>
                          <Text>{selectedRFG.paymentTerms}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>
                            Shipping Term
                          </Text>
                          <Text>{selectedRFG.termsOfTrade}</Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>Date Created</Text>
                          <Text>
                            {' '}
                            {new Date(
                              selectedRFG.createdAt,
                            ).toLocaleDateString()}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{fontFamily: 'Bold'}}>Requirements</Text>
                          <Text>{selectedRFG.productDescription}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </Modal>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    width: '100%',
    borderRadius: 16,
  },
  quoteCardTitleModal: {
    paddingVertical: 16,
    fontFamily: 'Bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  quoteCardDetails: {
    color: '#dc4d04',
  },
  quoteCardTitle: {
    fontFamily: 'Bold',
    fontSize: 16,
  },
  quote: {
    marginVertical: 24,
  },
  quoteCard: {
    backgroundColor: '#d8e3fb98',
    padding: 24,
    borderRadius: 12,
    gap: 12,
  },
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 16,
    marginTop: 36,
  },
  cardProduct: {
    width: 300,
    backgroundColor: '#fff',
    marginRight: 12,
    borderRadius: 10,
    height: 500,
    gap: 16,
  },
  cardImageProduct: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cardsellerProduct: {
    fontFamily: 'Regular',
  },
  cardProductView: {
    gap: 12,
    padding: 16,
  },
  cardtextProduct: {
    fontFamily: 'Bold',
    fontSize: 18,
  },
  cardpriceProduct: {
    fontFamily: 'Regular',
    fontSize: 14,
  },
  currencyView: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  cardcurrencyProduct: {
    fontFamily: 'Bold',
    fontSize: 18,
  },
  image: {
    height: 140,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  texts: {
    color: '#dc4d04',
    fontFamily: 'Bold',
    fontSize: 16,
    marginTop: 24,
    paddingVertical: 16,
  },
  textsProducts: {
    color: '#dc4d04',
    fontFamily: 'Bold',
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  card: {
    marginRight: 12,
    height: 175,
    width: 200,
    padding: 12,
    backgroundColor: '#Fff',
    borderRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: 110,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  cardTitle: {
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Regular',
    fontSize: 14,
  },
});

export default AllProducts;
