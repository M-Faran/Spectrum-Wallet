import React, { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

import OnboardingScreen from './screens/OnboardingScreen';
import CreateWalletScreen from './screens/CreateWalletScreen';
import ImportWalletScreen from './screens/ImportWalletScreen';
import WalletScreen from './screens/WalletScreen';
import WalletSetupScreen from './screens/WalletSetupScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import SendScreen from './screens/SendScreen';
import PasscodeScreen from './screens/PasscodeScreen';

const Stack = createNativeStackNavigator();

// Fallback SecureStore for web
const SecureStoreWeb = {
  async getItemAsync(key) {
    return Promise.resolve(localStorage.getItem(key));
  },
  async setItemAsync(key, value) {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    async function checkWallet() {
      let wallet;
      if (Platform.OS === 'web') {
        wallet = await SecureStoreWeb.getItemAsync('wallet');
      } else {
        wallet = await SecureStore.getItemAsync('wallet');
      }
      setHasWallet(wallet !== null);
      setIsLoading(false);
    }

    checkWallet();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasWallet ? (
          !isUnlocked ? (
            <Stack.Screen name="Passcode">
              {props => <PasscodeScreen {...props} setIsUnlocked={setIsUnlocked} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Wallet" component={WalletScreen} />
              <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
              <Stack.Screen name="SendScreen" component={SendScreen} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
            <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
            <Stack.Screen name="WalletSetup" component={WalletSetupScreen} />
            <Stack.Screen name="WalletScreen" component={WalletScreen} />
            <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
            <Stack.Screen name="SendScreen" component={SendScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

