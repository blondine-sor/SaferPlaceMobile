import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

interface UploadedFile {
  type: 'document' | 'audio';
  uri: string;
  name: string;
}

interface MultiUploadInputProps {
  onSubmit: (text: string, file?: UploadedFile) => void;
  placeholder?: string;
}

const MultiUploadInput: React.FC<MultiUploadInputProps> = ({ 
  onSubmit, 
  placeholder = "Type your message..." 
}) => {
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        // Clear any existing audio
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        setUploadedFile({
          type: 'document',
          uri: result.assets[0].uri,
          name: result.assets[0].name
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        // Clear any existing audio
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        // Create new sound object
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: result.assets[0].uri },
          { shouldPlay: false }
        );

        // Set up audio playback status monitoring
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying) {
            setIsPlaying(false);
          }
        });

        setSound(newSound);
        setUploadedFile({
          type: 'audio',
          uri: result.assets[0].uri,
          name: result.assets[0].name
        });
      }
    
    } catch (error) {
      Alert.alert('Error', 'Failed to upload audio');
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const clearUpload = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setUploadedFile(null);
  };

  const handleSubmit = () => {
    if (inputText.trim() || uploadedFile) {
      onSubmit(inputText, uploadedFile || undefined);
      setInputText('');
      clearUpload();
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      {uploadedFile && (
        <View style={styles.uploadPreview}>
          <View style={styles.uploadInfo}>
            <FontAwesome 
              name={uploadedFile.type === 'audio' ? 'music' : 'file'} 
              size={16} 
              color="#666" 
            />
            <Text style={styles.fileName} numberOfLines={1}>
              {uploadedFile.name}
            </Text>
          </View>
          
          <View style={styles.uploadActions}>
            {uploadedFile.type === 'audio' && (
              <TouchableOpacity 
                style={styles.playButton} 
                onPress={handlePlayPause}
              >
                <FontAwesome 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={16} 
                  color="#4A90E2" 
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearUpload}
            >
              <FontAwesome name="times" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholder}
          multiline
        />
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={pickDocument}
          >
            <FontAwesome name="file" size={20} color="#359356" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={pickAudio}
          >
            <FontAwesome name="music" size={20} color="#359356" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (!inputText && !uploadedFile) && styles.sendButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!inputText && !uploadedFile}
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
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: '#359356',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#96c3a6',
  },
  uploadPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  uploadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  uploadActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    padding: 8,
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
  },
});

export default MultiUploadInput;