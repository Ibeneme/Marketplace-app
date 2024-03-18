import React from 'react';
import { WebView } from 'react-native-webview';

const TestPaymentPage = () => {
  const publicKey = 'FLWPUBK-2ee5d0dabe02aabd10b0b905e71d1237-X';
  const txRef = Date.now();
  const amount = 1000; // Replace this with the desired amount

  // Construct the payment URL
  const paymentUrl = `https://checkout.flutterwave.com/v3/hosted/pay?public_key=${publicKey}&tx_ref=${txRef}&amount=${amount}`;

  return <WebView source={{ uri: paymentUrl }} />;
};

export default TestPaymentPage;
