import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const TutorialButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.tutorialButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="question-circle" size={20} color="#fff" />
        <Text style={styles.tutorialButtonText}>How It Works</Text>
      </TouchableOpacity>

      <TutorialModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const tutorialContent = [
    {
      title: "Welcome to SaferPlace",
      description: "Discover how to make the most of our features with this quick tutorial.",
      icon: "rocket"
    },
    {
      title: "Key Features",
      description: "Our powerful tools in VerifyMessages helps you check your text, audio and documents for any toxic content",
      icon: "star"
    },
    {
      title: "Get Started",
      description: "You can add emergency contacts with the Add Contact feature on the top right corner of the app",
      icon: "check-circle"
    }
  ];

  const nextPage = () => {
    if (currentPage < tutorialContent.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
          >
            <FontAwesome name="times" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <FontAwesome 
              name={tutorialContent[currentPage].icon as any}
              size={48} 
              color="#44d575" 
              style={styles.icon}
            />
            <Text style={styles.title}>
              {tutorialContent[currentPage].title}
            </Text>
            <Text style={styles.description}>
              {tutorialContent[currentPage].description}
            </Text>
          </View>

          <View style={styles.dotsContainer}>
            {tutorialContent.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPage && styles.activeDot
                ]}
              />
            ))}
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              onPress={previousPage}
              style={[
                styles.button,
                styles.backButton,
                currentPage === 0 && styles.disabledButton
              ]}
              disabled={currentPage === 0}
            >
              <FontAwesome name="chevron-left" size={16} color="#666" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextPage}
              style={[styles.button, styles.nextButton]}
            >
              <Text style={styles.nextButtonText}>
                {currentPage === tutorialContent.length - 1 ? 'Finish' : 'Next'}
              </Text>
              <FontAwesome name="chevron-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Tutorial Button Styles
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#44d575',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tutorialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.9,
    maxWidth: 400,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#44d575',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: '#44d575',
  },
  backButtonText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  nextButtonText: {
    marginRight: 8,
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default TutorialButton;