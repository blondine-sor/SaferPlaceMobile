import { useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import MultiUploadInput from '@/components/Outils';

export default function TabTwoScreen() {

  interface UploadedFile {
    type: 'document' | 'audio';
    uri: string;
    name: string;
  }


  //temporary submission function
  const handleSubmit = (texts: string, file?: UploadedFile) => {
    if(texts){
      fetch("https://toxicityrecognition.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: texts }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
    }
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello User</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View>
        <Text
                  style={styles.getStartedText}
                  lightColor="rgba(0,0,0,0.8)"
                  darkColor="rgba(255,255,255,0.8)">
                  Connectez-vous pour acceder à vos outils de verification de messages.
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <MultiUploadInput onSubmit={handleSubmit} />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
});
