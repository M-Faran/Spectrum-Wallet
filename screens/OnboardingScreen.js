import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function OnboardingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Spectrum Wallet</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Create a New Wallet"
                    onPress={() => navigation.navigate('CreateWallet')}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Import a Wallet"
                    onPress={() => navigation.navigate('ImportWallet')}
                    color="#007AFF"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        marginBottom: 48,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '80%',
        marginBottom: 20,
    },
});