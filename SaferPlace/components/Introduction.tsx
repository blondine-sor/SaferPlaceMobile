import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions } from 'react-native';
import { Messages } from '@/scripts/interfaces';


interface MessageCardProps {
  messages: Messages[];
  interval?: number;
  cardStyle?: object;
}

const MessageCard: React.FC<MessageCardProps> = ({
  messages,
  interval = 3000,
  cardStyle = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const animateMessage = () => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change message
        setCurrentIndex((prevIndex) => 
          prevIndex === messages.length - 1 ? 0 : prevIndex + 1
        );
        
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const intervalId = setInterval(animateMessage, interval);
    return () => clearInterval(intervalId);
  }, [messages.length, interval, fadeAnim]);

  return (
    <View style={[styles.container, cardStyle]}>
      <View style={styles.card}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>
            {messages[currentIndex].title}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.content}>
            {messages[currentIndex].content}
          </Text>
          <Text style={styles.messageId}>
            ID: {messages[currentIndex].id}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    width: Dimensions.get('window').width - 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#506055',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#44d575',
    marginVertical: 8,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  messageId: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    textAlign: 'right',
  },
});

export default MessageCard;