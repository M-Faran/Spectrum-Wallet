import 'dotenv/config';

export default {
    expo: {
        // ...other config...
        extra: {
            ALCHEMY_SEPOLIA_URL: process.env.ALCHEMY_SEPOLIA_URL,
        },
    },
};