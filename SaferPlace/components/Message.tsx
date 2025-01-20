import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions,
  Animated, 
  Platform
} from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MessageDuJour: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [author, setAuthor] = useState<string>('');
  const [quote, setQuote] = useState<string>('');

  // Request notification permissions
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
      
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications to receive daily quotes');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    fetchMessage();
  }, []);

  const showNotification = async (quote: string, author: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Quote of the Day',
          body: `"New Quote From" - ${author}`,
          data: { quote, author },
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  //retrieves messages of the day
  const fetchMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.2.11:8055/get_quote');
      const data = await response.json();
      setAuthor(data.author);
      setQuote(data.quote);
      
      // Show notification when new quote is received
      await showNotification(data.quote, data.author);
      
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

  // Handle notification interaction
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        // Handle what happens when user taps the notification
        console.log('Notification tapped:', data);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

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
        <Text style={styles.title}>Message of the Day : {author}  </Text>
        
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
              {quote}
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
    width: Dimensions.get('window').width - 30,
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
    backgroundColor: '#63e8bf',
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