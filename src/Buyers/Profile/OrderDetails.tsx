import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import CustomHeader from '../../Helpers/ProductHeaders';
import Svg, { Line } from 'react-native-svg';
import { StackParamList } from '../../../Routing/Buyers/BuyersStack';
import { useCurrency } from '../../Helpers/CurrencyConverter';

type OrderDetailsProps = {
  route: RouteProp<StackParamList, 'OrderDetails'>;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ route }) => {
  const { showInUSD } = useCurrency();
  const { order } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Order Details</Text>
        <View style={styles.detailsContainer}>
          {renderDetailRow('Title', order?.item?.productName)}
          {renderDetailRow('Order Number', order?.item?.orderNumber)}
          {renderDetailRow('Payment Type', order?.item?.paymentTerm)}
          {renderDetailRow('Shipping Type', order?.item?.shippingType)}
          {renderDetailRow(
            'Total Cost',
            `    ${
              showInUSD
                ? `NGN${(parseFloat(order?.item?.cost) * 1400).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
                : `USD${parseFloat(order?.item?.cost).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
            }`,
          )}
          {renderDetailRow('Country of Origin', order?.item?.countryOfOrigin)}
          {renderDetailRow('Destination', order?.item?.destination)}
          {renderDetailRow('Incoterms', order?.item?.incoterm)}
          {renderDetailRow('Quantity Ordered', order?.item?.quantityOrdered)}
        </View>
        <Text style={[styles.title, { paddingTop: 32 }]}>Order History</Text>
        <View style={styles.historyContainer}>
          <View style={styles.historyItem}>
            {<DashedLine />}
            <Text style={styles.historyStatus}>{order?.item.status}</Text>
            <Text style={styles.historyDate}>{formatDate(order?.item.createdAt)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderDetailRow = (label: string, value: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.labelText}>{label}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const DashedLine: React.FC = () => (
  <Svg height="100%" width="20">
    <Line
      x1="50%"
      y1="0"
      x2="50%"
      y2="100%"
      stroke="#3498db"
      strokeDasharray="5 2"
      strokeWidth="1"
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Bold',
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Regular',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyContainer: {
    flexDirection: 'column',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    height: 50,
  },
  historyStatus: {
    fontSize: 16,
    fontFamily: 'Bold',
    marginRight: 8,
  },
  historyDate: {
    fontSize: 14,
    fontFamily: 'Regular',
  },
});

export default OrderDetails;
