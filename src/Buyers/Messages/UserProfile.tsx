import React from 'react';
import { View, Image, Text } from 'react-native';
import { styles } from './styles';

interface ReceiversMessageProps {
  profileImageUrl: string;
  sentImageUrl?: string;
  text: string;
}

const ReceiversMessage: React.FC<ReceiversMessageProps> = ({
  profileImageUrl,
  sentImageUrl,
  text,
}) => {
  return (
    <View style={styles.flex}>
      {profileImageUrl && <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />}

      <View>
        {sentImageUrl && <Image source={{ uri: sentImageUrl }} style={styles.sentImage} />}

        <View style={[styles.messageBubble, styles.receiverMessage]}>
          <Text style={styles.messageText}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

export default ReceiversMessage;