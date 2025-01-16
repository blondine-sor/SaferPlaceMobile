import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useAuth } from '@/context/AuthContex';
import { Link, useRouter } from 'expo-router';




const NavigationMenu = () => {
  const router = useRouter();

  const { logout } = useAuth();

  const handlelogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => { logout(),
        router.push('/') }
      },
    ]);
    
  }

  return (
    <View style={styles.container}>
      <Link href="/(settings)/setting" asChild>
      <TouchableOpacity style={styles.button}>
        <FontAwesome name="cog" size={24} color="#333" />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      </Link>
       
      <Link href="/(settings)/addContact" asChild>
      <TouchableOpacity style={styles.button}>
        <FontAwesome name="user-plus" size={24} color="#333" />
        <Text style={styles.buttonText}>Add Contact</Text>
      </TouchableOpacity>
      </Link>

      <TouchableOpacity 
        style={[styles.button, styles.disconnectButton]}
        onPress={() =>  handlelogout()}
      >
        <FontAwesome name="power-off" size={24} color="#fff" />
        <Text style={[styles.buttonText, styles.disconnectText]}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  disconnectButton: {
    backgroundColor: '#ff4444',
  },
  disconnectText: {
    color: '#fff',
  },
});

export default NavigationMenu;