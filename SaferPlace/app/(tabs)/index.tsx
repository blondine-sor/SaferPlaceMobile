import { StyleSheet, ScrollView } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import MessageCard from '@/components/Introduction';
import TutorialButton from '@/components/Tutorial';
import MessageDuJour from '@/components/Message';
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
    <ScrollView
      showsVerticalScrollIndicator={true}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      bounces={true}
      bouncesZoom={true}
      alwaysBounceVertical={true}
      alwaysBounceHorizontal={false}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <MessageDuJour/>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <TutorialButton />
      </View>
      </ScrollView>
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
