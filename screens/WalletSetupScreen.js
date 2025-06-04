import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SecureStoreWeb = {
    async setItemAsync(key, value) {
        localStorage.setItem(key, value);
        return Promise.resolve();
    },
};

export default function WalletSetupScreen({ navigation }) {
    const [walletName, setWalletName] = useState('');
    const [passcode, setPasscode] = useState('');
    const [confirmPasscode, setConfirmPasscode] = useState('');

    const handleNext = async () => {
        if (passcode === confirmPasscode) {
            // Save passcode securely
            if (Platform.OS === 'web') {
                await SecureStoreWeb.setItemAsync('passcode', passcode);
            } else {
                await SecureStore.setItemAsync('passcode', passcode);
            }
            navigation.navigate('WalletScreen');
        } else {
            Alert.alert('Error', 'Passcodes do not match!');
        }
    };

    const passcodesMatch = passcode !== '' && passcode === confirmPasscode;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Wallet Setup</Text>

            <TextInput
                style={styles.input}
                placeholder="Wallet Name"
                value={walletName}
                onChangeText={setWalletName}
            />

            <TextInput
                style={styles.input}
                placeholder="Create Passcode"
                secureTextEntry
                value={passcode}
                onChangeText={setPasscode}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Passcode"
                secureTextEntry
                value={confirmPasscode}
                onChangeText={setConfirmPasscode}
            />

            <Button title="Next" onPress={handleNext} disabled={!passcodesMatch} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 50,
    },
});
