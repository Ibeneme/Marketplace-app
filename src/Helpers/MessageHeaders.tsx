import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-remix-icon";
import { useCartContext } from "../Context/CartContext";
import { SellersData } from "../../Routing/Buyers/Types";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../Routing/Buyers/BuyersStack";
import { useCurrency } from "./CurrencyConverter";

type MessageHeadersProps = {
  title?: string;
  hideCart?: boolean;
  sellersData?: SellersData;
};

const MessageHeaders: React.FC<MessageHeadersProps> = ({
  title,
  hideCart,
  sellersData,
}) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { cart } = useCartContext();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCartPress = () => {
    navigation.navigate("Cart" as never);
  };

  const handleViewSeller = () => {
    if (sellersData) {
      navigation.navigate("SellersDetails", { sellersData } as never);
    }
  };
  const {toggleCurrency, showInUSD} = useCurrency();

  return (
    <View style={styles.header}>
      <View
        style={{
          gap: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-left-s-line" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleViewSeller}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#dc4d04",
                borderRadius: 24,
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "SemiBold",
                  padding: 12,
                }}
              >
                {sellersData?.LastName?.charAt(0)?.toUpperCase()}
                {sellersData?.firstName?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                marginLeft: 8,
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "SemiBold",
                  fontSize: 16,
                }}
              >
                <Text>
                  {sellersData?.firstName?.slice(0, 16) +
                    (sellersData?.firstName?.length ?? 0 > 16 ? "..." : "")}
                </Text>

                {/* {sellersData?.firstName} */}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Regular",
                  fontSize: 12,
                  marginVertical: 2,
                  color: "#808080",
                }}
              >
                {sellersData?.email}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>


      {!hideCart && (
        <TouchableOpacity onPress={handleCartPress}>
          <Icon name="shopping-cart-line" size={24} color="#000" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingRight: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
    fontFamily: "SemiBold",
  },
  cartBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#dc4d04",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
  },
});

export default MessageHeaders;
