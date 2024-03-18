import {ThunkDispatch} from '@reduxjs/toolkit';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {RootState} from '../../../Redux/store';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../Routing/Buyers/BuyersStack';
import {
  fetchMessageById,
  fetchUserMessages,
  getAllMessages,
  sendMessage,
  sendMessageResponse,
} from '../../../Redux/Messages/Messages';
import CustomHeader from '../../Helpers/ProductHeaders';
import MessageHeaders from '../../Helpers/MessageHeaders';
import {SellersData} from '../../../Routing/Buyers/Types';
import {fetchCurrentUser} from '../../../Redux/Auth/Auth';
import {User} from '../Profile/Profile';

export type Message = {
  id: string;
  content?: string;
  text?: string;
  sender?: string | Sender;
  date?: Date;
  time?: string;
  senderID?: string;
  data?: {
    message?: {
      response: string;
    };
  };
  createdAt?: string;
  messageID?: any;
  messageValue?: string;
  read?: boolean;
  receiverID?: string;
  updatedAt?: string;
  message?: string;
  receiverDetails?: {
    email: string;
    LastName: string;
    firstName: string;
  };
};

type SentMessageResponse = {
  sender?: string | Sender;
  data: {
    createdAt: string;
    id: string;
    message: string;
    read: boolean;
    receiverID: string;
    senderID: string;
    updatedAt: string;
    sender?: string | Sender;
  };
  message: string;
};

interface Sender {
  LastName: string;
  email: string;
  firstName: string;
  id: string;
  role: string;
}

const MessageComponent = () => {
  const route = useRoute();
  const {sellersData} = route.params as {sellersData: SellersData};

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesss, setResponse] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const [messageID, setMessageID] = useState(
    sellersData.messageID ? sellersData.messageID : ' ',
  );
  const [latestMessage, setLatestMessage] = useState('');
  const [recieversID, setRecieversID] = useState('');
  const userID = sellersData?.id;
  const [loading, setLoading] = useState(false);

  const [messageLoading, setMessageLoading] = useState(false);

  const newID = sellersData.messageID || messageID;
  const [yourID, setUserID] = useState<User | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .then((response: any) => {
        console.log(response?.payload?.currentUser.id, 'currentuser');
        const currentUser = response?.payload?.currentUser;
        setUserID(currentUser);
      })
      .catch((error: any) => {
        console.log('Error fetching current user:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (messageLoading) {
      AllMessages();
    }
  }, [messages]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
    AllMessages();
    if (sellersData?.messageID) {
      AllMessages();
      handleClick();
      fetchUserMessagesHandler();
    }
  }, [messages]);

  const [latestMessageTime, setLatestMessageTime] = useState<Date | null>(null);
  messagesss.sort(
    (a, b) =>
      new Date(a.createdAt as any).getTime() -
      new Date(b.createdAt as any).getTime(),
  );

  const senderID = yourID;

  messagesss.forEach((message: Message, index) => {
    const {sender, createdAt, messageValue} = message;
    const displayTime = new Date(createdAt as any).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (index === 0) {
    }
    if (messageValue !== undefined) {
      if (typeof sender === 'string') {
      } else {
        const isSender = sender?.id === senderID;
        if (isSender) {
        } else {
        }
      }
    }
  });

  const handleClick = () => {
    try {
      if (newID == ' ') {
        dispatch(fetchMessageById(messageID))
          .then(action => {
            if (fetchMessageById.fulfilled.match(action)) {
              const response = action.payload;
              const newMessages = response?.data?.message?.response;
              if (Array.isArray(newMessages)) {
                newMessages.forEach(msg => {
                  if (msg.senderID === userID) {
                    const createdAt = new Date(msg.createdAt);
                    if (!latestMessageTime || createdAt > latestMessageTime) {
                      setLatestMessage(msg.messageValue);
                      setLatestMessageTime(createdAt);
                    }
                  }
                });
              } else {
              }
            }
          })
          .catch(() => {});
      } else {
        dispatch(fetchMessageById(newID as string))
          .then(action => {
            if (fetchMessageById.fulfilled.match(action)) {
              const response = action.payload;
              const newMessages = response?.data?.message?.response;
              if (Array.isArray(newMessages)) {
                newMessages.forEach(msg => {
                  if (msg.senderID === userID) {
                    const createdAt = new Date(msg.createdAt);
                    if (!latestMessageTime || createdAt > latestMessageTime) {
                      setLatestMessage(msg.messageValue);
                      setLatestMessageTime(createdAt);
                    }
                  }
                });
              } else {
              }
            }
          })
          .catch(() => {});
      }
    } catch (error) {}
  };

  const fetchUserMessagesHandler = () => {
    dispatch(fetchUserMessages())
      .then(action => {
        if (fetchUserMessages.fulfilled.match(action)) {
          const response = action.payload;
        }
      })
      .catch(error => {});
  };
  const [firstMessage, setFirstMessage] = useState<string>('');
  const [firstMessages, setFirstMessages] = useState<string>('');
  const [primeCreatedAt, setPrimeCreatedAt] = useState<string>('');

  const AllMessages = () => {
    if (newID === ' ') {
      dispatch(getAllMessages())
        .then(action => {
          if (getAllMessages.fulfilled.match(action)) {
            const response = action.payload.data;
            const desiredMessageId = messageID;
            response.forEach((item: any) => {
              if (item.message.id === desiredMessageId) {
                setFirstMessages(item.message.message);
                setResponse(item.message.response);
                setPrimeCreatedAt(item.message.createdAt);
              }
            });
          }
        })
        .catch(error => {});
    } else {
      dispatch(getAllMessages())
        .then(action => {
          if (getAllMessages.fulfilled.match(action)) {
            const response = action.payload.data;
            const desiredMessageId = newID;
            response.forEach((item: any) => {
              if (item.message.id === desiredMessageId) {
                setFirstMessages(item.message.message);
                setResponse(item.message.response);
                setPrimeCreatedAt(item.message.createdAt);
              }
            });
          }
        })
        .catch(error => {});
    }
  };

  interface ReceivedMessage {
    id: string;
    content: string;
  }

  const handleSend = (receivedMessages: ReceivedMessage[]) => {
    if (message.trim() === '') {
      return;
    }
    console.log('done', newID);
    if (newID === ' ') {
      setMessageLoading(true);
      setLoading(true);
      console.log(userID, message, 'action');
      dispatch(sendMessage({to: userID, message: message}))
        .then(action => {
          setLoading(false);
          console.log(action, 'actions');
          if (sendMessage.fulfilled.match(action)) {
            const response: SentMessageResponse = action.payload;
            setMessageID(response?.data?.id);
            console.log(response?.data?.id, 'response?.data?.id');
            setFirstMessage(message);
            setMessageLoading(false);
          }
        })
        .catch(error => {
          setMessageLoading(false);
          setLoading(false);
        });
    } else {
      setMessageLoading(true);
      setLoading(true);
      dispatch(
        sendMessageResponse({
          messageID: newID ?? '',
          from: recieversID,
          message: message,
        }),
      )
        .then(action => {
          setLoading(false);
          if (fetchMessageById.fulfilled.match(action)) {
            const response = action.payload;

            setRecieversID(response?.data?.message?.recieverID);
            setMessageLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
          setMessageLoading(false);
        });
    }

    const currentDate = new Date();
    const currentTime = currentDate?.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }); // Format time
    const lastMessage = messages[messages.length - 1];
    const lastMessageTime = lastMessage
      ? lastMessage.date?.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : '';
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: 'some-id',
        content: message,
        sender: 'me',
        text: message,
        date: currentDate,
        time: lastMessageTime !== currentTime ? currentTime : undefined, // Add time only if different
      },
      ...receivedMessages.map(receivedMessage => ({
        id: receivedMessage.id,
        content: receivedMessage.content,
        sender: 'other',
        text: receivedMessage.content,
        date: currentDate,
        time: lastMessageTime !== currentTime ? currentTime : undefined, // Add time only if different
      })),
    ]);
    setMessage('');
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        ...receivedMessages.map(receivedMessage => ({
          id: receivedMessage.id,
          content: receivedMessage.content,
          sender: 'other',
          text: receivedMessage.content,
          date: currentDate,
          time: lastMessageTime !== currentTime ? currentTime : undefined, // Add time only if different
        })),
      ]);
    });
  };

  const [effectCounter, setEffectCounter] = useState(0);

  // useEffect(() => {
  //   if (loading === true) {
  //     AllMessages();
  //     const interval = setInterval(() => {
  //       handleSend([]);
  //       setEffectCounter((prevCounter) => prevCounter + 1);
  //     }, 100 / 3);
  //     const timeout = setTimeout(() => {
  //       clearInterval(interval);
  //     }, 3 * 60 * 1000);

  //     const resetCounterTimeout = setTimeout(() => {
  //       setEffectCounter(0);
  //     }, 3 * 60 * 1000);
  //     return () => {
  //       clearInterval(interval);
  //       clearTimeout(timeout);
  //       clearTimeout(resetCounterTimeout);
  //     };
  //   }
  // }, [loading, effectCounter]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <MessageHeaders sellersData={sellersData} />
      <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1, backgroundColor: '#f4f4f4'}}>
        <ScrollView ref={scrollViewRef}>
          {firstMessages ? (
            <View style={{marginBottom: 32}}>
              <Text
                style={{
                  color: '#dc4d04',
                  textAlign: 'center',
                  fontFamily: 'SemiBold',
                  fontSize: 12,
                  marginVertical: 12,
                }}>
                {new Date(primeCreatedAt as string).toLocaleTimeString()}
              </Text>
              <View
                style={[
                  styles.messageContainer,
                  {
                    alignSelf: 'flex-end',
                    marginBottom: 16,
                    backgroundColor: '#DCF8C6',
                  },
                ]}>
                <View
                  style={{
                    backgroundColor: '#dc4d04',

                    borderRadius: 6,
                    padding: 8,
                  }}>
                  <Text
                    style={{
                      color: '#fff',

                      padding: 8,
                      borderRadius: 24,
                      fontFamily: 'Regular',
                      fontSize: 16,
                    }}>
                    {firstMessages}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {messagesss.map((msg, index) => (
            <View key={index} style={{marginBottom: 32}}>
              <Text
                style={{
                  color: '#dc4d04',
                  textAlign: 'center',
                  fontFamily: 'SemiBold',
                  fontSize: 12,
                  marginVertical: 12,
                }}>
                {new Date(msg.createdAt as string).toLocaleTimeString()}
              </Text>
              <View
                style={[
                  styles.messageContainer,
                  {
                    alignSelf:
                      typeof msg.sender === 'object' &&
                      'email' in msg.sender &&
                      msg.sender.email === 'IBENEMEIKENNA96@GMAIL.COM'
                        ? 'flex-end'
                        : 'flex-start',
                    marginBottom: 16,
                    backgroundColor:
                      typeof msg.sender === 'object' &&
                      'email' in msg.sender &&
                      msg.sender.email === 'IBENEMEIKENNA96@GMAIL.COM'
                        ? '#DCF8C6'
                        : '#E5E5EA',
                  },
                ]}>
                <View
                  style={{
                    backgroundColor:
                      typeof msg.sender === 'object' &&
                      'email' in msg.sender &&
                      msg.sender.email === 'IBENEMEIKENNA96@GMAIL.COM'
                        ? '#dc4d04'
                        : '#E5E5EA',
                    borderRadius: 6,
                    padding: 8,
                  }}>
                  <Text
                    style={{
                      color:
                        typeof msg.sender === 'object' &&
                        'email' in msg.sender &&
                        msg.sender.email === 'IBENEMEIKENNA96@GMAIL.COM'
                          ? '#fff'
                          : '#000',
                      padding: 8,
                      borderRadius: 24,
                      fontFamily: 'Regular',
                      fontSize: 16,
                    }}>
                    {msg.messageValue}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            marginTop: 6,
            backgroundColor: '#Fff',
          }}>
          <TextInput
            style={{
              flex: 1,
              marginRight: 8,
              borderColor: '#80808065',
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
              fontSize: 16,
            }}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            onSubmitEditing={() => handleSend([])}
          />
          <Pressable
            style={{
              backgroundColor: '#dc4d04',
              padding: 16,
              borderRadius: 8,
              height: '100%',
              alignItems: 'center',
            }}
            onPress={() => handleSend([])}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontFamily: 'Regular',
                color: '#fff',
              }}>
              Send
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    margin: 8,
    borderRadius: 20,
    maxWidth: '80%',
  },
});

export default MessageComponent;
