import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Fallback SecureStore for web
const SecureStoreWeb = {
    async getItemAsync(key) {
        return Promise.resolve(localStorage.getItem(key));
    },
};

export default function ReceiveScreen({ navigation }) {
    const [address, setAddress] = useState('');

    useEffect(() => {
        async function fetchAddress() {
            let data;
            if (Platform.OS === 'web') {
                data = await SecureStoreWeb.getItemAsync('wallet');
            } else {
                data = await SecureStore.getItemAsync('wallet');
            }
            if (data) {
                const parsed = JSON.parse(data);
                setAddress(parsed.address);
            } else {
                Alert.alert('No Wallet', 'No wallet found. Please create or import a wallet.');
                navigation.replace('Onboarding');
            }
        }
        fetchAddress();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Receive ETH</Text>
            <Text style={styles.label}>Your Wallet Address:</Text>
            <Text selectable style={styles.address}>{address}</Text>
            {/* You can add a QR code here using a library like react-native-qrcode-svg */}
            <Button title="Back to Wallet" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#888',
        marginBottom: 8,
    },
    address: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 32,
        textAlign: 'center',
    },
});