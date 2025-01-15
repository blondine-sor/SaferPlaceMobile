import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

interface LoginScreenProps {
  visible: boolean;
  onClose: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


//   const login = async (username, password) => {
//     const response = await fetch('http://localhost:8000/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: new URLSearchParams({
//             'username': username,
//             'password': password
//         })
//     });

//     if (response.ok) {
//         const data = await response.json();
//         console.log('Login successful:', data);
//     } else {
//         const errorData = await response.json();
//         console.error('Login failed:', errorData);
//     }
// };
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.2.11:8000/login', {
        'email': email,
        'password': password
      });

      const data = response.data;
      console.log(data);
      setEmail('');
      setPassword('');
      onClose();
    //   const { access_token, user } = response.data;

      // Save user and token in AsyncStorage
    //   await AsyncStorage.setItem('accessToken', access_token);
    //   await AsyncStorage.setItem('user', JSON.stringify(user));

     // Alert.alert('Login Successful', `Welcome, ${user.username}!`);
      
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.centeredView}
    >
      <View style={styles.modalView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>User Login</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
                <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                </View>
            </View>

                <View style={styles.formGroup}>
                <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                </View>
            </View>

          

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLogin}
          >
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>
)
};


const styles = StyleSheet.create({
centeredView: {
  flex: 1,
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
},
modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 20,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  maxHeight: "80%",
},
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},
headerText: {
  fontSize: 20,
  fontWeight: "bold",
},
closeButton: {
  padding: 5,
},
formGroup: {
  marginBottom: 20,
},
inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  paddingHorizontal: 10,
  height: 50,
},
input: {
  flex: 1,
  marginLeft: 10,
  fontSize: 16,
},
label: {
  fontSize: 16,
  marginBottom: 8,
  color: "#333",
},
radioGroup: {
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: 30,
},
radioButton: {
  flexDirection: "row",
  alignItems: "center",
},
radioLabel: {
  marginLeft: 8,
  fontSize: 16,
  color: "#333",
},
submitButton: {
  backgroundColor: "#4CAF50",
  padding: 15,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
},
submitButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
},
});

export default LoginScreen;
