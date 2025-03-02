import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mode } from 'wagmi/chains';

// Define Mode Network if not available in wagmi/chains
const modeChain = mode || {
    id: 34443,
    name: 'Mode',
    network: 'mode',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: ['https://mainnet.mode.network'] },
        default: { http: ['https://mainnet.mode.network'] },
    },
    blockExplorers: {
        etherscan: { name: 'Mode Explorer', url: 'https://explorer.mode.network' },
        default: { name: 'Mode Explorer', url: 'https://explorer.mode.network' },
    },
};

export const wagmiConfig = getDefaultConfig({
    appName: 'Sentient Markets',
    projectId: 'c8d08053460bfe0752116d730dc6393b', // Your project ID
    chains: [modeChain],
});