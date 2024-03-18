import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../Helpers/ProductHeaders";
import Icon from "react-native-remix-icon";

const AuthenticationChoice: React.FC = () => {
  const navigation = useNavigation();

  const navigateToBuyerSignup = () => {
    navigation.navigate("BuyerSignup" as never);
  };

  const navigateToSellerSignup = () => {
    navigation.navigate("SellerSignup" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader 
      //goBackTwice
       />
      <ScrollView>
        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.headerText}>Choose your type of account</Text>
            <Text style={styles.subHeaderText}>
              You are a few steps away from creating your account
            </Text>
          </View>
          <TouchableOpacity
            onPress={navigateToBuyerSignup}
            style={styles.optionContainer}
          >
            <View style={styles.iconContainer}>
              <Icon name="user-fill" size={24} color="#dc4d04" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>Register as a Buyer</Text>
              <Text style={styles.regularText}>
                Access African suppliers and products
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToSellerSignup}
            style={styles.optionContainer}
          >
            <View style={styles.iconContainer}>
              <Icon name="briefcase-4-fill" size={24} color="#dc4d04" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>Register as a Seller</Text>
              <Text style={styles.regularText}>
                Access global markets for your products
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  infoContainer: {
    justifyContent: "center",
    flexDirection: "column",
    paddingVertical: 48,
  },
  headerText: {
    fontFamily: "Bold",
    fontSize: 16,
    paddingVertical: 2,
  },
  subHeaderText: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#666666",
  },
  optionContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginVertical: 16,
  },
  iconContainer: {
    backgroundColor: "#dc4d0425",
    padding: 12,
    borderRadius: 24,
    width: 48,
  },
  textContainer: {
    gap: 2,
  },
  boldText: {
    fontFamily: "Bold",
    fontSize: 16,
    paddingVertical: 2,
  },
  regularText: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#666666",
  },
});

export default AuthenticationChoice;
