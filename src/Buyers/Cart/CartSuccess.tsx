
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import CustomHeader from "../../Helpers/ProductHeaders";

const logoImage = require("../../../assets/fonts/pay.png");

export default function CartSuccess() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as { currency: string; amount: number };
  const { currency, amount } = routeParams;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleStyle: {
        fontFamily: "Regular",
      },
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={[
        styles.containerfirst,
        {
          backgroundColor: "#ffff",
          flex: 1,
        },
      ]}
    >
      <View style={{ width: "100%" }}>
        <CustomHeader hideCart />
      </View>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ padding: 16 }}
      >
        <View style={styles.container}>
          <Image source={logoImage} style={styles.logo} />
          <Text style={[styles.text, { marginBottom: 48 }]}>
            Your order has been recorded and will be processed once payment is
            confirmed! Please find the{" "}
            <Text style={{ color: "#dc4d04" }}> {currency} </Text> account bank
            details below for a smooth transaction
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginVertical: 8,
            }}
          >
            <Text style={styles.textLeft}> Cost of Product(s):</Text>
            <Text style={styles.textRight}>
              {currency} {amount}{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginVertical: 8,
            }}
          >
            <Text style={styles.textLeft}> Bank name:</Text>
            <Text style={styles.textRight}> Union bank </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginVertical: 8,
            }}
          >
            <Text style={styles.textLeft}> Account Name:</Text>
            <Text style={styles.textRight}> TOFADOTCOM Ltd </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginVertical: 8,
            }}
          >
            <Text style={styles.textLeft}> Account Number:</Text>
            <Text style={styles.textRight}> 0075960233</Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#dc4d0415",
            padding: 16,
            gap: 6,
            marginVertical: 24,
            marginTop: -48,
          }}
        >
          <Text
            style={{ color: "#dc4d04", fontFamily: "SemiBold", fontSize: 16 }}
          >
            Important Notice
          </Text>
          <Text
            style={{
              color: "#dc4d04",
              fontFamily: "Regular",
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            Upon completing your payment, please proceed to your dashboard's
            Orders page and select the View option corresponding to your order.
            Once the order information page has loaded, kindly upload the
            necessary proof of payment. This step is crucial to facilitate the
            processing of your order efficiently. Should you require further
            information or assistance, please don't hesitate to get in touch
            withus at support@tradersofafrica.com. We're here to help! Feel free
            to access your dashboard to keep track of all your Request for
            Quotes.Thank you for choosing our platform.
          </Text>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Orders" as never)}
            style={styles.buttonClick}
          >
            <Text style={styles.buttonText}>Continue to Orders Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard" as never)}
            style={styles.buttonClicks}
          >
            <Text style={styles.buttonTexts}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerfirst: {
    height: "100%",
  },
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 94,
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontFamily: "SemiBold",
    marginTop: "5%",
    textAlign: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  textsmall: {
    textAlign: "center",
    fontSize: 16,
    marginTop: "02%",
    fontFamily: "Regular",
    lineHeight: 24,
    color: "#808080",
  },
  textLeft: {
    color: "#000",
    fontSize: 16,
    fontFamily: "SemiBold",
    textAlign: "left",
  },
  textRight: {
    textAlign: "right",
    fontSize: 16,
    fontFamily: "Regular",
    lineHeight: 24,
    color: "#808080",
  },
  containerButton: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    //marginTop: -32,
  },
  buttonClick: {
    backgroundColor: "#dc4d04",
    width: "100%",
    height: 55,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonClicks: {
    borderColor: "#dc4d04",
    width: "100%",
    height: 55,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 64,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Regular",
    fontSize: 16,
  },
  buttonTexts: {
    color: "#dc4d04",
    fontFamily: "Regular",
    fontSize: 16,
  },
});
