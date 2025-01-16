import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface EmergencyModalProps {
  accuracy: number;
  label: 'toxic' | 'not_toxic';
  visible: boolean;
  onClose: () => void;
}

interface EmergencyContact {
  name: string;
  phone: string;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ 
  accuracy, 
  label, 
  visible, 
  onClose 
}) => {
  // Round accuracy to 2 decimal places
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  
  // Mock emergency contacts - in a real app, these would come from props or context
  const emergencyContacts: EmergencyContact[] = [
    { name: 'Emergency Contact 1', phone: '123-456-7890' },
    { name: 'Emergency Contact 2', phone: '098-765-4321' }
  ];

  const isToxic = label === 'toxic';
  const isHighConfidence = roundedAccuracy >= 0.75;

  const getAlertStyles = () => {
    if (isToxic && isHighConfidence) {
      return styles.redAlert;
    } else if (isToxic && !isHighConfidence) {
      return styles.yellowAlert;
    }
    return styles.greenAlert;
  };

  const getAlertTextStyles = () => {
    if (isToxic && isHighConfidence) {
      return styles.redText;
    } else if (isToxic && !isHighConfidence) {
      return styles.yellowText;
    }
    return styles.greenText;
  };

  const renderContent = () => {
    if (!isToxic) {
      return (
        <View style={[styles.alert, getAlertStyles()]}>
          <Text style={[styles.alertText, getAlertTextStyles()]}>
            This message appears to be fine! No concerns detected.
            {'\n'}Confidence: {roundedAccuracy * 100}%
          </Text>
        </View>
      );
    }

    return (
      <View>
        <View style={[styles.alert, getAlertStyles()]}>
          <Text style={[styles.alertText, getAlertTextStyles()]}>
            {isHighConfidence 
              ? `Warning: Harmful content detected with ${roundedAccuracy * 100}% confidence!`
              : `Potential harmful content detected (${roundedAccuracy * 100}% confidence). Would you like to contact someone?`}
          </Text>
        </View>
        
        {(isHighConfidence || !isHighConfidence) && (
          <View style={styles.contactsContainer}>
            <Text style={styles.contactsTitle}>Emergency Contacts:</Text>
            {emergencyContacts.map((contact, index) => (
              <View key={index} style={styles.contactCard}>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.phoneButton}
                  onPress={() => {/* Handle phone call */}}
                >
                  <FontAwesome name="phone" size={24} color="#2196F3" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isToxic 
                ? isHighConfidence 
                  ? 'Emergency Alert'
                  : 'Content Warning'
                : 'Content Check'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {renderContent()}

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.closeButtonFull} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  alert: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  redAlert: {
    backgroundColor: '#FFEBEE',
  },
  yellowAlert: {
    backgroundColor: '#FFF8E1',
  },
  greenAlert: {
    backgroundColor: '#E8F5E9',
  },
  alertText: {
    fontSize: 16,
    lineHeight: 24,
  },
  redText: {
    color: '#C62828',
  },
  yellowText: {
    color: '#F57F17',
  },
  greenText: {
    color: '#2E7D32',
  },
  contactsContainer: {
    marginTop: 10,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  phoneButton: {
    padding: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
  },
  footer: {
    marginTop: 20,
  },
  closeButtonFull: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EmergencyModal;