import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { Audio } from 'expo-av';

const EmergencyButton: React.FC = () => {
  const [isActivated, setIsActivated] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const soundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Preload the sound
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/alarm.wav')
        );
        soundRef.current = sound;
      } catch (error) {
        console.error('Error loading sound', error);
      }
    };

    loadSound();

    // Cleanup sound when component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current);
      }
    };
  }, []);

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current);
      }
    }
  };

  const handleEmergency = async () => {
    // If already activated, stop the sound
    if (isActivated) {
      await stopSound();
      setIsActivated(false);
      return;
    }

    setIsActivated(true);
    
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();

        // Stop sound after 10 seconds
        soundTimeoutRef.current = setTimeout(async () => {
          await stopSound();
          setIsActivated(false);
        }, 10000);
      }
    } catch (error) {
      console.error('Error playing sound', error);
    }
    
    // Call emergency services
    Linking.openURL('tel:911');
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isActivated ? styles.activatedButton : styles.defaultButton
      ]}
      onPress={handleEmergency}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {isActivated ? (
          <>
            <X color="white" size={24} style={styles.icon} />
            <Text style={styles.buttonText}>Stop Alarm</Text>
          </>
        ) : (
          <>
            <AlertTriangle color="white" size={24} style={styles.icon} />
            <Text style={styles.buttonText}>Emergency</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  defaultButton: {
    backgroundColor: '#dc2626',
  },
  activatedButton: {
    backgroundColor: '#991b1b',
    transform: [{ scale: 1.05 }],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmergencyButton;