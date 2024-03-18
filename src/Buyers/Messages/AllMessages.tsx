import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessages } from "../../../Redux/Messages/Messages";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../../Redux/store";
import CustomHeader from "../../Helpers/ProductHeaders";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "../../../Routing/Buyers/BuyersStack";
import LoadingComponent from "../../Components/ShimmerLoader";
const logoImage = require("../../../assets/Tofa.png");
import Icon from "react-native-remix-icon";

type AllMessageComponentProps = {
  route: RouteProp<StackParamList, "AllMessageComponent">;
};

type Message = {
  createdAt?: string;
  id?: string;
  message?: string;
  read?: boolean;
  recieverID?: string;
  response?: any[];
  sender?: Record<string, any>;
  senderID?: string;
  updatedAt?: string;
  messageId?: string;
  receiverId?: string;
  senderId?: string;
  messageID: string;
  firstName: string;
  LastName: string;
  email: string;
};

type ReceiverDetails = {
  LastName: string;
  email: string;
  firstName: string;
  role: string;
};

type MessageType = {
  message: Message;
  receiverDetails?: ReceiverDetails;
};

const AllMessageComponent: React.FC<AllMessageComponentProps> = ({ route }) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { profile } = route.params;

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(() => {
      handleRefresh();
    }, 120000);

    return () => clearInterval(interval);
  }, [dispatch, profile]);
  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();

      return () => {};
    }, [dispatch, profile])
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllMessages())
      .then((action) => {
        setLoading(false);
        if (getAllMessages.fulfilled.match(action)) {
          const response = action.payload;
          const filteredMessages = response.data.filter(
            (item: any) => item.message.senderID === profile?.id
          );
          filteredMessages.sort((a: any, b: any) => {
            const aTime =
              a.message.response[0]?.updatedAt ?? a.message.updatedAt;
            const bTime =
              b.message.response[0]?.updatedAt ?? b.message.updatedAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });

          setMessages(filteredMessages);
          console.log("Number of messages:", filteredMessages.length);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching messages:", error);
      });
  }, [dispatch, profile]);

  const handleRefresh = () => {
    dispatch(getAllMessages())
      .then((action) => {
        setLoading(false);
        if (getAllMessages.fulfilled.match(action)) {
          const response = action.payload;
          const filteredMessages = response.data.filter(
            (item: any) => item.message.senderID === profile?.id
          );

          filteredMessages.sort((a: any, b: any) => {
            const aTime =
              a.message.response[0]?.updatedAt ?? a.message.updatedAt;
            const bTime =
              b.message.response[0]?.updatedAt ?? b.message.updatedAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });

          setMessages(filteredMessages);
          console.log("Number of messages:", filteredMessages.length);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching messages:", error);
      });
  };

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleNavigation = (
    messageId: string,
    receiverId: string,
    senderId: string,
    firstName: string,
    lastName: string,
    email: string
  ) => {
    const sellersData: Message = {
      messageID: messageId,
      id: receiverId,
      senderId: senderId,
      firstName: firstName,
      LastName: lastName,
      email: email,
    };

    navigation.navigate("Messaging", { sellersData: sellersData } as any);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Messages" />
      {/* <Button title="Refresh Messages" onPress={handleRefresh} /> */}
      {loading ? (
        <LoadingComponent logo={logoImage} />
      ) : (
        <View style={{ height: "100%", backgroundColor: "#f4f4f4" }}>
          <View style={styles.messagesContainer}>
            <ScrollView>
              {messages.length === 0 && (
                <View style={styles.noMessagesContainer}>
                  <Icon name="message-line" size={50} color="#ccc" />
                  <Text style={styles.noMessagesText}>No messages found</Text>
                </View>
              )}

              {messages?.map((messageItem) => (
                <TouchableOpacity
                  onPress={() =>
                    handleNavigation(
                      messageItem?.message?.id || "", // Provide a default value if undefined
                      messageItem?.message.recieverID || "", // Corrected property name
                      messageItem?.message.senderID || "", // Corrected property name
                      messageItem?.receiverDetails?.firstName || "", // Provide a default value if undefined
                      messageItem?.receiverDetails?.LastName || "", // Provide a default value if undefined
                      messageItem?.receiverDetails?.email || "" // Provide a default value if undefined
                    )
                  }
                >
                  <View key={messageItem.message.id} style={styles.messageItem}>
                    {messageItem.receiverDetails && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#dc4d04",
                              borderRadius: 24,
                              width: 40,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 14,
                                fontFamily: "SemiBold",
                                padding: 0,
                              }}
                            >
                              {messageItem?.receiverDetails?.LastName?.charAt(
                                0
                              )?.toUpperCase()}
                              {messageItem?.receiverDetails?.firstName
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </Text>
                          </View>
                          <View style={{ alignItems: "flex-start" }}>
                            <Text
                              style={{
                                textAlign: "center",
                                fontFamily: "SemiBold",
                                fontSize: 16,
                              }}
                            >
                              {capitalizeFirstLetter(
                                messageItem.receiverDetails.firstName
                              ).slice(0, 7) +
                                (messageItem.receiverDetails.firstName.length >
                                7
                                  ? "..."
                                  : "")}{" "}
                              {capitalizeFirstLetter(
                                messageItem.receiverDetails.LastName
                              ).slice(0, 7) +
                                (messageItem.receiverDetails.LastName.length > 7
                                  ? "..."
                                  : "")}
                            </Text>
                            <Text
                              style={{
                                textAlign: "center",
                                fontFamily: "Regular",
                                fontSize: 13,
                                marginVertical: 2,
                                color: "#808080",
                              }}
                            >
                              {messageItem?.message?.response &&
                              messageItem?.message?.response[0]
                                ?.messageValue ? (
                                <Text
                                  style={{
                                    fontFamily: "Regular",
                                    fontSize: 13,
                                  }}
                                >
                                  Reply:{" "}
                                  {
                                    messageItem?.message?.response[0]
                                      ?.messageValue
                                  }
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    fontFamily: "Regular",
                                    fontSize: 13,
                                  }}
                                >
                                  You: {messageItem?.message?.message}
                                </Text>
                              )}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              textAlign: "center",
                              fontFamily: "Regular",
                              fontSize: 13,
                              marginVertical: 2,
                              color: "#808080",
                            }}
                          >
                            {messageItem?.message?.response &&
                            messageItem?.message?.response[0]?.updatedAt ? (
                              <Text
                                style={{
                                  fontFamily: "Regular",
                                  fontSize: 13,
                                }}
                              >
                                {getTimeAgo(
                                  messageItem?.message?.response[0]?.updatedAt
                                )}
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontFamily: "Regular",
                                  fontSize: 13,
                                }}
                              >
                                {getTimeAgo(
                                  messageItem?.message?.updatedAt ?? ""
                                ) ?? " "}
                              </Text>
                            )}
                          </Text>

                          <Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "SemiBold",
                                color: "#808080",
                              }}
                            ></Text>
                          </Text>
                        </View>
                      </View>
                    )}
                    <View></View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#Fff",
  },
  noMessagesContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Regular",
  },
  messagesContainer: {
    marginTop: 20,
  },
  messageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 5,
  },
});

export default AllMessageComponent;
