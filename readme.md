# 🪙 Spectrum Wallet (React Native)

A simple mobile cryptocurrency wallet built with **React Native**, using **ethers.js** for wallet creation and import, and **expo-secure-store** for secure storage.

---

## 📱 Features

* ✅ Create a new Ethereum wallet with a 12-word recovery phrase
* ✅ Display each mnemonic word in a **separate input box**
* ✅ Import an existing wallet by entering a 12-word phrase
* ✅ Clipboard support for copying mnemonic
* ✅ Secure storage of wallet details (address, mnemonic, private key)
* ✅ Easy navigation between onboarding, create, import, and setup screens

---

## 🛠️ Tech Stack

| Tool / Library      | Purpose                               |
| ------------------- | ------------------------------------- |
| React Native (Expo) | Cross-platform mobile app development |
| `ethers.js`         | Wallet creation and phrase handling   |
| `expo-secure-store` | Securely storing sensitive data       |
| `expo-clipboard`    | Copying mnemonic to clipboard         |
| `react-navigation`  | Managing screen navigation            |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/spectrum-wallet.git
cd spectrum-wallet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run on Expo

```bash
npx expo start
```

Scan the QR code from Expo Go on your phone or use an emulator.

---

## 📂 Project Structure

```
/screens
  ├── OnboardingScreen.js
  ├── CreateWalletScreen.js
  ├── ImportWalletScreen.js
  ├── WalletSetupScreen.js
  └── WalletScreen.js
```

---

## 🔐 Wallet Security Notes

* Wallet mnemonic and private keys are stored locally using `expo-secure-store`
* This is a **demo prototype** — avoid using with real funds
* For production apps, consider integrating biometric auth and advanced encryption

---

## 💡 Future Improvements

* [ ] Biometric login (Face ID / Fingerprint)
* [ ] WalletConnect integration
* [ ] Balance and transaction display
* [ ] QR code scanning for address input
* [ ] Support for zkSync, Polygon, and other chains

---

## 🙋‍♂️ Author
****
Feel free to reach out for contributions or queries!
https://github.com/M-Faran
---

## 📝 License

This project is licensed under the MIT License.

---
