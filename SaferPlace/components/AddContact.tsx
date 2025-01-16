import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContex';
import { set } from 'mongoose';

interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    user_id: number;
    level: 'high' | 'medium' | 'low';
}

const EmergencyContactForm = () => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<'high' | 'medium' | 'low'>('medium');
    const { userInfo } = useAuth();

    const handleAddContact = () => {
        if (contacts.length >= 5) {
            Alert.alert('Maximum Limit Reached', 'You can only add up to 5 emergency contacts.');
            return;
        }

        if (!name || !phone) {
            Alert.alert('Invalid Input', 'Please fill in all fields.');
            return;
        }

        if (!userInfo) {
            Alert.alert('User Info Missing', 'User information is not available.');
            return;
        }

        const newContact: EmergencyContact = {
            id: Date.now().toString(),
            name,
            phone,
            user_id: userInfo.id,
            level: selectedLevel,
        };

        setContacts([...contacts, newContact]);
        setName('');
        setPhone('');
        setSelectedLevel('medium');
    };

    const handleDeleteContact = (id: string) => {
        setContacts(contacts.filter(contact => contact.id !== id));
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'high':
                return '#ff4444';
            case 'medium':
                return '#ffbb33';
            case 'low':
                return '#00C851';
            default:
                return '#ffbb33';
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Emergency Contacts</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Contact Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                />

                <Text style={styles.label}>Priority Level:</Text>
                <View style={styles.radioGroup}>
                    {['high', 'medium', 'low'].map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[
                                styles.radioButton,
                                { backgroundColor: getLevelColor(level) },
                                selectedLevel === level && styles.radioButtonSelected
                            ]}
                            onPress={() => setSelectedLevel(level as 'high' | 'medium' | 'low')}
                        >
                            <Text style={styles.radioText}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddContact}
                >
                    <Text style={styles.addButtonText}>Add Contact</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contactsList}>
                {contacts.map((contact) => (
                    <View key={contact.id} style={styles.contactCard}>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactName}>{contact.name}</Text>
                            <View 
                                style={[
                                    styles.levelIndicator,
                                    { backgroundColor: getLevelColor(contact.level) }
                                ]}
                            >
                                <Text style={styles.levelText}>{contact.level}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleDeleteContact(contact.id)}
                            style={styles.deleteButton}
                        >
                            <FontAwesome name="trash" size={20} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        backgroundColor: '#fff',
        padding: 15,
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    radioButton: {
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderWidth: 2,
        borderColor: '#333',
    },
    radioText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contactsList: {
        marginTop: 20,
    },
    contactCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contactId: {
        color: '#666',
        marginTop: 5,
    },
    levelIndicator: {
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    levelText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 10,
    },
});

export default EmergencyContactForm;