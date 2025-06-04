import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import 'react-native-get-random-values';
import { ethers } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';

const SecureStoreWeb = {
    async getItemAsync(key) {
        return Promise.resolve(localStorage.getItem(key));
    },
    async setItemAsync(key, value) {
        localStorage.setItem(key, value);
        return Promise.resolve();
    },
    async deleteItemAsync(key) {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};

export default function CreateWalletScreen({ navigation }) {
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom();
        setWallet(newWallet);
    }, []);

    const copyToClipboard = async () => {
        if (wallet?.mnemonic?.phrase) {
            await Clipboard.setStringAsync(wallet.mnemonic.phrase);
            Alert.alert('Copied', 'Mnemonic copied to clipboard!');
        }
    };

    const handleNext = async () => {
        if (wallet) {
            if (Platform.OS === 'web') {
                await SecureStoreWeb.setItemAsync(
                    'wallet',
                    JSON.stringify({
                        address: wallet.address,
                        mnemonic: wallet.mnemonic.phrase,
                        privateKey: wallet.privateKey,
                    })
                );
            } else {
                await SecureStore.setItemAsync(
                    'wallet',
                    JSON.stringify({
                        address: wallet.address,
                        mnemonic: wallet.mnemonic.phrase,
                        privateKey: wallet.privateKey,
                    })
                );
            }
            navigation.navigate('WalletSetup');
        }
    };

    if (!wallet) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Recovery Phrase</Text>
            <View style={styles.mnemonicContainer}>
                {wallet.mnemonic.phrase.split(' ').map((word, idx) => (
                    <View key={idx} style={styles.wordBox}>
                        <Text style={styles.wordText}>{word}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyText}>Copy to Clipboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Phrase Noted - Go Next</Text>
            </TouchableOpacity>
            <Button title="Back to Onboarding" onPress={() => navigation.goBack()} />
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
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mnemonicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    wordBox: {
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 4,
        minWidth: 60,
        alignItems: 'center',
    },
    wordText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    copyButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        alignSelf: 'center',
    },
    copyText: {
        color: 'white',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
