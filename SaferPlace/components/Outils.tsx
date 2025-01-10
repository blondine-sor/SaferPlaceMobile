import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Platform,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

interface MultiInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

const MultiInput: React.FC<MultiInputProps> = ({ 
  onSubmit, 
  placeholder = "Type your message..." 
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Handle text upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled && 'name' in result) {
        setInputText(`File uploaded: ${result.name}`);
        setHasRecording(false);
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  // Handle audio recording
  const startRecording = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
        setHasRecording(false);
        setInputText('Recording...');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setIsRecording(false);
        setRecording(null);
        setHasRecording(true);
        setInputText('Audio recorded and ready to play');
        
        // Create sound object for playback
        if(uri){
 
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false }
        );
        setSound(newSound);

        // Add playback status listener
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying) {
            setIsPlaying(false);
          }
        });
      }
    }
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  // Handle audio playback
  const handlePlayback = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.replayAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText('');
      setHasRecording(false);
      if (sound) {
        sound.unloadAsync();
        setSound(null);
      }
    }
  };

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setHasRecording(false);
          }}
          placeholder={placeholder}
          multiline
        />
        
        <View style={styles.actionsContainer}>
          {hasRecording && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handlePlayback}
            >
              <FontAwesome 
                name={isPlaying ? "pause" : "play"} 
                size={20} 
                color="#4A90E2" 
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleFileUpload}
          >
            <FontAwesome name="file-text-o" size={20} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <FontAwesome 
              name={isRecording ? "stop-circle" : "microphone"} 
              size={20} 
              color={isRecording ? "#FF3B30" : "#4A90E2"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sendButton, !inputText && styles.sendButtonDisabled]}
            onPress={handleSubmit}
            disabled={!inputText}
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#B4D2F4',
  },
});

export default MultiInput;