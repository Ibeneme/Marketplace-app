import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import CustomHeader from "../../Helpers/ProductHeaders";
import Icon from "react-native-remix-icon";

type Props = {};

const Messages = (props: Props) => {
  const hasMessages = false; 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader />
      <View style={styles.container}>
        {hasMessages ? (
          <Text>Messages Found</Text>
        ) : (
          <View style={styles.noMessagesContainer}>
            <Icon name="message-line" size={50} color="#ccc" />
            <Text style={styles.noMessagesText}>No messages found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontSize: 16,
    marginTop: 16,
    fontFamily:'Regular'
  },
});

export default Messages;
