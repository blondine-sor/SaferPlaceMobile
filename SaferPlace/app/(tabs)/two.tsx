import { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import MultiUploadInput from '@/components/Outils';
import UserFormModal from '@/components/User';
import { UploadedFile, UserFormData, AlertVariant } from '@/scripts/interfaces';
import Alert from '@/components/Alerte';

export default function TabTwoScreen() {

 
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [variant, setVariant] = useState<AlertVariant>('success');
  const [message, setMessage] = useState('');

  //text submission
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

  //function to add a user
  const  addUser= async(user: UserFormData) => {
    if(user.name && user.email && user.password && user.phone){
    try{ 
    const response = await fetch('http://192.168.2.11:8000/add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log('User added:', data);
    if(data.status === "user added" ){
    setAlertVisible(true);
    setTitle('Success');
    setVariant('success');
    setMessage('User added successfully');}
    if(data.status === "user already exists"){
      setAlertVisible(true);
      setTitle('Warning');
      setVariant('warning');
      setMessage("This email is already in use");
    }}
    catch(error){
      console.error('Failed to add user:', error);
      setAlertVisible(true);
      setTitle('Warning');
      setVariant('warning');
      setMessage('Failed to add user');
    }
   
    
    }
    else{
      setAlertVisible(true);
      setTitle('Error');
      setVariant('error');
      setMessage('Please fill all fields');
    }
    
  };
  return (
    <View style={styles.container}>
       <View style={{ flex: 1, alignItems:'flex-end' }}>
      <Button title="Add User" color={'#44d575'} onPress={() => setModalVisible(true)} />
      
      <UserFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addUser}
      />
    </View>
    <View style={{flex: 1, alignItems:'center'}}>
      <Text style={styles.title}>Hello User</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View>
        <Text
                  style={styles.getStartedText}
                  lightColor="rgba(0,0,0,0.8)"
                  darkColor="rgba(255,255,255,0.8)">
                  Create an account to use all the features of the app
        </Text>
      </View>
      {/* Multiupload form for user to enter text document or audio to be verified */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <MultiUploadInput onSubmit={handleSubmit} />
    </View>
    {/** Alert component shown when the request is successful */}
    {alertVisible && (
      <Alert
        title={title}
        variant={variant}
        message={message}
        duration={5000}
        onDismiss={() => setAlertVisible(false)}
      />
    )
}
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
