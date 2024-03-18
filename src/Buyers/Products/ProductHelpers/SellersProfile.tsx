import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-remix-icon";

interface ProductActionsProps {
  sellerName: string;
  onAddToCart: () => void;
  onRequestQuote: () => void;
  buttonLabel: string;
  onStartMessage: () => void;
  viewSellersProfile: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  sellerName,
  onAddToCart,
  onRequestQuote,
  buttonLabel,
  onStartMessage,
  viewSellersProfile,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Text style={styles.circleText}>
          {sellerName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.sellerName, styles.marginVertical]}>
        {sellerName}
      </Text>
      <TouchableOpacity onPress={viewSellersProfile}>
        <Text style={[styles.viewProfileText, styles.marginBottom]}>
          View Seller's Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={onAddToCart}>
        <Text style={styles.actionButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.requestQuoteButton]}
        onPress={onRequestQuote}
      >
        <Text style={[styles.actionButtonText, styles.requestQuoteText]}>
          Request Quote
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.messageButton} onPress={onStartMessage}>
        <Text style={styles.messageButtonText}>Send a Message</Text>
        <Icon name="chat-1-line" size={24} color="#dc4d04" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: "#66666636",
    borderRadius: 12,
  },
  circleContainer: {
    backgroundColor: "#dc4d04",
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  circleText: {
    color: "#fff",
    fontFamily: "Bold",
    fontSize: 24,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: "Bold",
  },
  viewProfileText: {
    textDecorationLine: "underline",
    color: "#dc4d04",
    fontFamily: "Regular",
  },
  marginVertical: {
    marginVertical: 12,
  },
  marginBottom: {
    marginBottom: 36,
  },
  actionButton: {
    backgroundColor: "#dc4d04",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#dc4d04",
  },
  actionButtonText: {
    color: "white",
    fontFamily: "SemiBold",
    textAlign: "center",
    fontWeight: "bold",
  },
  requestQuoteButton: {
    backgroundColor: "white",
  },
  requestQuoteText: {
    color: "#dc4d04",
  },
  messageButton: {
    flexDirection: "row",
    backgroundColor: "#dc4d0412",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    padding: 12,
    borderRadius: 8,
  },
  messageButtonText: {
    fontFamily: "Regular",
    color: "#dc4d04",
    fontSize: 16,
    marginRight: 6,
  },
});

export default ProductActions;
