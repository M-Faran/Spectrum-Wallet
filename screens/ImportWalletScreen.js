import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { ethers } from 'ethers';
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

export default function ImportWalletScreen({ navigation }) {
    const [words, setWords] = useState(Array(12).fill(''));

    const handleWordChange = (text, idx) => {
        const wordsArray = text.trim().split(/\s+/);
        if (idx === 0 && wordsArray.length > 1) {
            // Only allow full phrase paste in the first box
            const newWords = Array(12).fill('');
            for (let i = 0; i < 12; i++) {
                newWords[i] = wordsArray[i] ? wordsArray[i] : '';
            }
            setWords(newWords);
        } else {
            // Only update the current word
            const updated = [...words];
            updated[idx] = text.replace(/\s/g, '');
            setWords(updated);
        }
    };

    const handleImport = async () => {
        try {
            const cleanedWords = words.map(w => w.trim().toLowerCase().normalize('NFKD'));
            if (cleanedWords.some(w => !w) || cleanedWords.length !== 12) {
                Alert.alert('Incomplete Phrase', 'Please fill in all 12 words.');
                return;
            }
            const cleanedMnemonic = cleanedWords.join(' ');
            console.log('Mnemonic to import:', cleanedMnemonic);
            const wallet = ethers.Wallet.fromPhrase
                ? ethers.Wallet.fromPhrase(cleanedMnemonic)
                : ethers.Wallet.fromMnemonic(cleanedMnemonic);

            if (Platform.OS === 'web') {
                await SecureStoreWeb.setItemAsync(
                    'wallet',
                    JSON.stringify({
                        address: wallet.address,
                        mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : cleanedMnemonic,
                        privateKey: wallet.privateKey,
                    })
                );
            } else {
                await SecureStore.setItemAsync(
                    'wallet',
                    JSON.stringify({
                        address: wallet.address,
                        mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : cleanedMnemonic,
                        privateKey: wallet.privateKey,
                    })
                );
            }

            navigation.navigate('WalletSetup');
        } catch (error) {
            Alert.alert('Invalid Mnemonic', 'Please enter a valid 12-word phrase.');
            console.log('Import error:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Import Wallet</Text>
            <View style={styles.wordsContainer}>
                {words.map((word, idx) => (
                    <TextInput
                        key={idx}
                        style={styles.wordInput}
                        placeholder={`Word ${idx + 1}`}
                        value={word}
                        onChangeText={text => handleWordChange(text, idx)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                    />
                ))}
            </View>
            <View style={styles.buttonGroup}>
                <Button title="Back to Onboarding" onPress={() => navigation.goBack()} />
                <View style={{ height: 16 }} />
                <Button title="Import Wallet" onPress={handleImport} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
    },
    wordInput: {
        width: '28%',
        minWidth: 80,
        margin: 4,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonGroup: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
});