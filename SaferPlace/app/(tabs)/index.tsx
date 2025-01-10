import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import MessageCard from '@/components/Introduction';
import { messages } from '@/scripts/messages';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
     <MessageCard 
      messages={messages}
      interval={4000}
      cardStyle={{ backgroundColor: '#dff3e6' }}
    />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
});
