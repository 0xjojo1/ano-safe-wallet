import { OnboardAPI } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { Web3OnboardProvider, init } from '@web3-onboard/react';
import wagmi from '@web3-onboard/wagmi';

const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/2b651335cb1a4e46b347641dad274135';

const injected = injectedModule();

const wallets = [injected];

const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: MAINNET_RPC_URL,
  },
  {
    id: 11155111,
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/2b651335cb1a4e46b347641dad274135',
  },
  {
    id: '0x13881',
    token: 'MATIC',
    label: 'Polygon - Mumbai',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  },
  {
    id: '0xA',
    token: 'OETH',
    label: 'OP Mainnet',
    rpcUrl: 'https://mainnet.optimism.io',
  },
  {
    id: '0xA4B1',
    token: 'ARB-ETH',
    label: 'Arbitrum',
    rpcUrl: 'https://rpc.ankr.com/arbitrum',
  },
  {
    id: '0xa4ec',
    token: 'ETH',
    label: 'Celo',
    rpcUrl: 'https://1rpc.io/celo',
  },
  {
    id: 666666666,
    token: 'DEGEN',
    label: 'Degen',
    rpcUrl: 'https://rpc.degen.tips',
  },
  {
    id: 2192,
    token: 'SNAX',
    label: 'SNAX Chain',
    rpcUrl: 'https://mainnet.snaxchain.io',
  },
];

const appMetadata = {
  name: 'Connect Wallet Example',
  icon: '<svg>My App Icon</svg>',
  description: 'Example showcasing how to connect a wallet.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
  ],
};

export const web3Onboard: OnboardAPI = init({
  wallets,
  chains,
  appMetadata,
});

function MyWeb3OnboardProvider({ children }: { children: React.ReactNode }) {
  return <Web3OnboardProvider web3Onboard={web3Onboard}>{children}</Web3OnboardProvider>;
}

export default MyWeb3OnboardProvider;
