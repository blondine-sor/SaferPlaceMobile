import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Animated, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContex';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { userInfo } = useAuth()

  // Animation for opening/closing the chat window
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleSend = async() => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isBot: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      

      const user_query={
        "user_id": userInfo?.id || 0,
        "username": userInfo?.name || "",
        "query":newMessage.text 
      }
      try{
       const response = await fetch('https://safeteechatbot.onrender.com/chat',{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user_query),
       })

       const data = await response.json()
       console.log('response:',data.response)
    
      // Simulate bot response (replace with actual bot logic)
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response.answer,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }catch(error){
        console.error("Error sending message:", error);
        // Add error message
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Sorry, I encountered an error. Please try again.',
            isBot: true,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);

    }
    }
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  return (
    <View style={styles.container}>
      {/* Chat toggle button */}
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <FontAwesome 
          name={isOpen ? "chevron-down" : "comments"} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>

      {/* Chat window */}
      {isOpen && (
        <Animated.View 
          style={[
            styles.chatWindow,
            { transform: [{ translateY }] },
            { opacity: slideAnim }
          ]}
        >
          {/* Bot header */}
          <View style={styles.header}>
            <Image
              style={styles.botImage}
              source={require('../assets/images/safetee.png')} 
            />
            <Text style={styles.headerText}>Chat Assistant: Safetee</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <FontAwesome name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Messages area */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((msg) => (
              <View 
                key={msg.id}
                style={[
                  styles.message,
                  msg.isBot ? styles.botMessage : styles.userMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  msg.isBot ? styles.botMessageText : styles.userMessageText
                ]}>
                  {msg.text}
                </Text>
                <Text style={[
                  styles.timestamp,
                  msg.isBot ? styles.botTimestamp : styles.userTimestamp
                ]}>
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Input area */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "android" ? "padding" : "height"}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
            >
              <FontAwesome name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#28b709',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatWindow: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    width: 300,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  botImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContent: {
    padding: 10,
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  botMessage: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userMessage: {
    backgroundColor: '#54a444',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 14,
  },
  botMessageText: {
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  botTimestamp: {
    color: '#666',
  },
  userTimestamp: {
    color: '#rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#28b709',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBot;