import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SecureStoreWeb = {
    async getItemAsync(key) {
        return Promise.resolve(localStorage.getItem(key));
    },
    async deleteItemAsync(key) {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};

export default function PasscodeScreen({ navigation, setIsUnlocked }) {
    const [input, setInput] = useState('');

    const handleSubmit = async () => {
        let storedPasscode;
        if (Platform.OS === 'web') {
            storedPasscode = await SecureStoreWeb.getItemAsync('passcode');
        } else {
            storedPasscode = await SecureStore.getItemAsync('passcode');
        }
        if (input === storedPasscode) {
            setIsUnlocked(true); // <-- Now this will work!
        } else {
            Alert.alert('Incorrect Passcode', 'The passcode you entered is incorrect.');
            setInput('');
        }
    };

    const handleReset = async () => {
        if (Platform.OS === 'web') {
            await SecureStoreWeb.deleteItemAsync('wallet');
            await SecureStoreWeb.deleteItemAsync('passcode');
        } else {
            await SecureStore.deleteItemAsync('wallet');
            await SecureStore.deleteItemAsync('passcode');
        }
        setIsUnlocked(false); // <-- Now this will work!
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Passcode</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your passcode"
                value={input}
                onChangeText={setInput}
                secureTextEntry
                keyboardType="number-pad"
            />
            <Button title="Unlock" onPress={handleSubmit} />
            <View style={{ height: 16 }} />
            <Button title="Reset Wallet" color="#d9534f" onPress={handleReset} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'center',
    },
});