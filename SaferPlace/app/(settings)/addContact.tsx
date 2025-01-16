import { useState } from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/context/AuthContex';
import EmergencyContactForm from '@/components/AddContact';



export default function AddContact (){
   return(
        <EmergencyContactForm/>
   )
}