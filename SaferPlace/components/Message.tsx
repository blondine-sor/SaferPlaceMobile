import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  Animated 
} from 'react-native';

interface Message {
  content: string;
}

const MessageDuJour: React.FC = () => {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch('YOUR_API_ENDPOINT/message-of-the-day');
      const data = await response.json();
      setMessage(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError('Failed to load message');
    } finally {
      setLoading(false);
    }
  };

  const refreshMessage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      fetchMessage();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Message du Jour</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
            <Text style={styles.messageText}>
              {message?.content}
            </Text>
          </Animated.View>
        )}

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshMessage}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshButtonText}>Refresh Message</Text>
        </TouchableOpacity>
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
    padding: 20,
    width: Dimensions.get('window').width - 32,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  loadingContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
  messageContainer: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MessageDuJour;