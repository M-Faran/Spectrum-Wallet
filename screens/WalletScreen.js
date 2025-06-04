import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';
import Constants from 'expo-constants';

const SEPOLIA_RPC_URL = Constants.expoConfig.extra.ALCHEMY_SEPOLIA_URL;

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

export default function WalletScreen({ navigation }) {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        let data;
        if (Platform.OS === 'web') {
          data = await SecureStoreWeb.getItemAsync('wallet');
        } else {
          data = await SecureStore.getItemAsync('wallet');
        }
        if (data) {
          const parsed = JSON.parse(data);
          setWallet(parsed);
          fetchBalance(parsed.address);
        } else {
          console.warn('No wallet found in SecureStore');
        }
      } catch (e) {
        console.error('Error loading wallet:', e);
      }
    };

    const fetchBalance = async (address) => {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const bal = await provider.getBalance(address);
        setBalance(ethers.formatEther ? ethers.formatEther(bal) : ethers.utils.formatEther(bal));
      } catch (e) {
        setBalance('0');
      }
    };
    fetchWallet();
  }, []);

  const resetWallet = async () => {
    if (Platform.OS === 'web') {
      await SecureStoreWeb.deleteItemAsync('wallet');
      await SecureStoreWeb.deleteItemAsync('passcode');
    } else {
      await SecureStore.deleteItemAsync('wallet');
      await SecureStore.deleteItemAsync('passcode');
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const showPrivateKey = () => {
    if (wallet && wallet.privateKey) {
      Alert.alert(
        'Private Key',
        wallet.privateKey,
        [{ text: 'OK', style: 'cancel' }],
        { cancelable: true }
      );
    } else {
      Alert.alert('Error', 'Private key not available.');
    }
  };

  if (!wallet) {
    return (
      <View style={styles.centered}>
        <Text>Loading Wallet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spectrum Wallet</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Wallet Address</Text>
        <Text style={styles.address}>{wallet.address}</Text>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>{balance === null ? 'Loading...' : `${balance} ETH`}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SendScreen')}>
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ReceiveScreen')}>
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={showPrivateKey}
          disabled={!wallet || !wallet.privateKey}
        >
          <Text style={styles.actionText}>Show Private Key</Text>
        </TouchableOpacity>
      </View>
      <Button title="Reset Wallet" color="#d9534f" onPress={resetWallet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f7f7',
    justifyContent: 'flex-start',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});