import {ThunkDispatch} from '@reduxjs/toolkit';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {RootState} from '../../../Redux/store';
import {useNavigation} from '@react-navigation/native';
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
  messageID?: string;
  messageValue?: string;
  read?: boolean;
  receiverID?: string;
  updatedAt?: string;
  message?: {
    senderID: string;
    updatedAt: string;
  };
};
interface Sender {
  id: string;
  // Add other properties if needed
}

type SentMessageResponse = {
  data: {
    createdAt: string;
    id: string;
    message: string;
    read: boolean;
    receiverID: string;
    senderID: string;
    updatedAt: string;
  };
  message: string;
};

interface MessageItem {
  message: {
    message: string;
    id: string;
    createdAt: string;
    response: any[];
  };
}
interface Sender {
  LastName: string;
  email: string;
  firstName: string;
  id: string;
  role: string;
}

const MessageComponents = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const [messageID, setMessageID] = useState('');
  const [latestMessage, setLatestMessage] = useState('');
  const [recieversID, setRecieversID] = useState('');
  const userID = '94c93c83-2464-4644-baf7-cc6d34623850';
  // useEffect to scroll to the bottom when messages change

  const AllMessages = () => {
    dispatch(getAllMessages())
      .then(action => {
        if (getAllMessages.fulfilled.match(action)) {
          const response = action.payload.data;
          console.log('ALL getAllMessages:', response);
          const desiredMessageId = '5d8ac9a7-5062-4bdb-9542-fbc58e031952'; // Replace "desired_message_id" with the ID you want to match
          response.forEach((item: any) => {
            if (item.message.id === desiredMessageId) {
              console.log('Message:', item.message.message);
              console.log('Created At:', item.message.createdAt);
              console.log('Response Array:', item.message.response);
            }
          });
        }
      })
      .catch(error => {
        //console.log("Error  user messages:", error);
      });
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }

    if (messageID) {
      handleClick();
      fetchUserMessagesHandler();
      AllMessages();
    }
  }, [messages]);

  // Inside the MessageComponent function
  const [latestMessageTime, setLatestMessageTime] = useState<Date | null>(null);

  const messagesss: Message[] = [
    {
      createdAt: '2024-02-04T04:18:58.046Z',
      id: '2a2fcda0-8a04-414f-9b11-cd3da92c99c5',
      messageID: '5d8ac9a7-5062-4bdb-9542-fbc58e031952',
      messageValue: 'reply',
      read: false,
      receiverID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      sender: {
        LastName: 'Ikenna',
        email: 'ikennaibenemee@gmail.com',
        firstName: 'Ibeneme',
        id: '94c93c83-2464-4644-baf7-cc6d34623850',
        role: 'SELLER',
      },
      senderID: '94c93c83-2464-4644-baf7-cc6d34623850',
      updatedAt: '2024-02-04T04:18:58.047Z',
    },
    {
      createdAt: '2024-02-04T04:18:55.526Z',
      id: '8711388e-5495-4f83-8bf3-5bdf84663566',
      messageID: '5d8ac9a7-5062-4bdb-9542-fbc58e031952',
      messageValue: 'okay',
      read: false,
      receiverID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      sender: {
        LastName: 'Ikenna',
        email: 'ikennaibenemee@gmail.com',
        firstName: 'Ibeneme',
        id: '94c93c83-2464-4644-baf7-cc6d34623850',
        role: 'SELLER',
      },
      senderID: '94c93c83-2464-4644-baf7-cc6d34623850',
      updatedAt: '2024-02-04T04:18:55.526Z',
    },
    {
      createdAt: '2024-02-04T04:52:31.828Z',
      id: 'd3686a58-42d0-410d-9f5f-918ae23a8d09',
      messageID: '5d8ac9a7-5062-4bdb-9542-fbc58e031952',
      messageValue: 'Yeamanh',
      read: false,
      receiverID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      sender: {
        LastName: 'ibeneme',
        email: 'IBENEMEIKENNA96@GMAIL.COM',
        firstName: 'ikenna',
        id: '33da7e83-277a-4213-8ae8-1e6e5433591a',
        role: 'BUYER',
      },
      senderID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      updatedAt: '2024-02-04T04:52:31.829Z',
    },
    {
      createdAt: '2024-02-04T04:53:37.895Z',
      id: 'd59c29be-882b-48b7-8b39-ee7e6e04ac64',
      messageID: '5d8ac9a7-5062-4bdb-9542-fbc58e031952',
      messageValue: 'wow',
      read: false,
      receiverID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      sender: {
        LastName: 'Ikenna',
        email: 'ikennaibenemee@gmail.com',
        firstName: 'Ibeneme',
        id: '94c93c83-2464-4644-baf7-cc6d34623850',
        role: 'SELLER',
      },
      senderID: '94c93c83-2464-4644-baf7-cc6d34623850',
      updatedAt: '2024-02-04T04:53:37.896Z',
    },
    {
      createdAt: '2024-02-04T04:53:36.557Z',
      id: 'd99ce1c3-18cb-4f41-a5da-18d4419962c6',
      messageID: '5d8ac9a7-5062-4bdb-9542-fbc58e031952',
      messageValue: 'wow',
      read: false,
      receiverID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      sender: {
        LastName: 'Ikenna',
        email: 'ikennaibenemee@gmail.com',
        firstName: 'Ibeneme',
        id: '94c93c83-2464-4644-baf7-cc6d34623850',
        role: 'SELLER',
      },
      senderID: '94c93c83-2464-4644-baf7-cc6d34623850',
      updatedAt: '2024-02-04T04:53:36.558Z',
    },
    {
      createdAt: '2024-02-04T04:53:38.902Z',
      id: 'ea546509-243f-411c-a6c4-50308a84b8d1',
      messageID: '5d8ac9a7-5062-4bdb-9542-fbc58e031952',
      messageValue: 'ow',
      read: false,
      receiverID: '33da7e83-277a-4213-8ae8-1e6e5433591a',
      sender: {
        LastName: 'Ikenna',
        email: 'ikennaibenemee@gmail.com',
        firstName: 'Ibeneme',
        id: '94c93c83-2464-4644-baf7-cc6d34623850',
        role: 'SELLER',
      },
      senderID: '94c93c83-2464-4644-baf7-cc6d34623850',
      updatedAt: '2024-02-04T04:53:38.903Z',
    },
  ];

  // Sorting messagesss by creation time
  messagesss.sort(
    (a, b) =>
      new Date(a.createdAt as any).getTime() -
      new Date(b.createdAt as any).getTime(),
  );

  // Determine sender and receiver for each message
  const senderID = '94c93c83-2464-4644-baf7-cc6d34623850'; // Example user ID
  const receiverID = '33da7e83-277a-4213-8ae8-1e6e5433591a'; // Example user ID

  messagesss.forEach((message: Message) => {
    const {sender, createdAt, messageValue} = message;
    const displayTime = new Date(createdAt as any).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (messageValue !== undefined) {
      if (typeof sender === 'string') {
        // Handle case where sender is a string
        console.log(`${displayTime} | ${messageValue.padEnd(20)} |`);
      } else {
        // Handle case where sender is an object with an id property
        const isSender = sender?.id === senderID;
        if (isSender) {
          console.log(`${displayTime} | ${messageValue.padEnd(20)} |`);
        } else {
          console.log(
            `                             | ${messageValue.padEnd(
              20,
            )} | ${displayTime}`,
          );
        }
      }
    }
  });

  // Inside the handleClick function
  const handleClick = () => {
    try {
      dispatch(fetchMessageById(messageID))
        .then(action => {
          if (fetchMessageById.fulfilled.match(action)) {
            const response = action.payload;
            //console.log("Fetch message success:", response);

            const newMessages = response?.data?.message?.response;
            // Check if response is an array
            if (Array.isArray(newMessages)) {
              newMessages.forEach(msg => {
                if (msg.senderID === userID) {
                  //console.log(msg, "LL");
                  // Check if the received message's createdAt time is greater than the time of the latest message received
                  const createdAt = new Date(msg.createdAt);
                  if (!latestMessageTime || createdAt > latestMessageTime) {
                    setLatestMessage(msg.messageValue);
                    setLatestMessageTime(createdAt);
                  }
                }
              });
            } else {
              //console.log("Response is not an array.");
            }
          }
        })
        .catch(error => {
          //console.log("Error fetching message:", error);
        });
    } catch (error) {
      //console.log("Error dispatching fetchMessageById action:", error);
    }
  };

  const handleMessageReply = () => {
    try {
      dispatch(
        sendMessageResponse({
          messageID: messageID,
          from: recieversID,
          message: message,
        }),
      )
        .then(action => {
          if (fetchMessageById.fulfilled.match(action)) {
            const response = action.payload;
            //console.log(
            //   "Fetch message success:",
            //     response?.data?.message?.response
            //    );
            setRecieversID(response?.data?.message?.recieverID);
          }
        })
        .catch(error => {});
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

  return (
    <View>
      <ScrollView ref={scrollViewRef}>
        {messagesss.map((msg, index) => (
          <View key={index}>
            <Text>
              {typeof msg.sender === 'string'
                ? msg.sender
                : msg.sender?.firstName}
              : {msg.messageValue}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MessageComponents;
