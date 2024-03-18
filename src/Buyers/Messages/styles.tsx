import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    flex: {
      flexDirection: 'row',
    },
    container: { padding: 8, backgroundColor: '#fff', flex: 1 },
    profileImage: {
      width: 28,
      height: 28,
      borderRadius: 20,
      marginRight: 8,
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    senderMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#DADEE3', // Sender's message color
    },
    receiverMessage: {
      alignSelf: 'flex-start',
      width: '100%',
      marginTop: 6,
      backgroundColor: '#F4F6F9', // Receiver's message color
    },
    messageText: {
      fontSize: 16,
      color: '#000', // Text color for both sender and receiver
    },
    timestamp: {
      fontSize: 12,
      color: '#888',
      marginTop: 4,
      textAlign: 'right',
    },
    sentImage: {
      width: '100%',
      height: 200, // Adjust the height as needed
      borderRadius: 8,
      marginTop: 8,
      minWidth: 200,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 8,
      marginBottom: 32,
    },
    input: {
      flex: 1,
      paddingHorizontal: 8,
      height: 40,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginRight: 8,
      color: '#666',
    },
    sendButton: {
      backgroundColor: '#121212',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      width: 48,
      height: 38,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });