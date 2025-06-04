import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Fallback SecureStore for web
const SecureStoreWeb = {
    async getItemAsync(key) {
        return Promise.resolve(localStorage.getItem(key));
    },
};

const SEPOLIA_RPC_URL = Constants.expoConfig.extra.ALCHEMY_SEPOLIA_URL;

export default function SendScreen({ navigation }) {
    const [walletData, setWalletData] = useState(null);
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        async function fetchWallet() {
            let data;
            if (Platform.OS === 'web') {
                data = await SecureStoreWeb.getItemAsync('wallet');
            } else {
                data = await SecureStore.getItemAsync('wallet');
            }
            if (data) {
                setWalletData(JSON.parse(data));
            } else {
                Alert.alert('No Wallet', 'No wallet found. Please create or import a wallet.');
                navigation.replace('Onboarding');
            }
        }
        fetchWallet();
    }, []);

    const handleSend = async () => {
        if (!ethers.isAddress(to)) {
            Alert.alert('Invalid Address', 'Please enter a valid Ethereum address.');
            return;
        }
        let ethAmount;
        try {
            ethAmount = ethers.parseEther(amount);
        } catch {
            Alert.alert('Invalid Amount', 'Please enter a valid ETH amount.');
            return;
        }
        setSending(true);
        try {
            const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
            const wallet = new ethers.Wallet(walletData.privateKey, provider);

            const tx = await wallet.sendTransaction({
                to,
                value: ethAmount,
            });

            await tx.wait();

            Alert.alert('Success', `Transaction sent!\nHash: ${tx.hash}`);
            setTo('');
            setAmount('');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send transaction.');
        } finally {
            setSending(false);
        }
    };

    if (!walletData) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Send Sepolia ETH</Text>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.address}>{walletData.address}</Text>
            <TextInput
                style={styles.input}
                placeholder="Recipient Address"
                value={to}
                onChangeText={setTo}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount (ETH)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
            />
            <Button title={sending ? 'Sending...' : 'Send'} onPress={handleSend} disabled={sending} />
            <View style={{ height: 16 }} />
            <Button title="Back to Wallet" onPress={() => navigation.goBack()} disabled={sending} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#f7f7f7',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#888',
        marginBottom: 4,
    },
    address: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});