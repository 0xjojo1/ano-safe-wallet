import { OnboardAPI } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { Web3OnboardProvider, init } from '@web3-onboard/react';

import * as chains from 'viem/chains';

const injected = injectedModule();

const appMetadata = {
  name: 'Connect Wallet Example',
  icon: '<svg>My App Icon</svg>',
  description: 'Example showcasing how to connect a wallet.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
  ],
};

console.log(chains.baseSepolia);

export const web3Onboard: OnboardAPI = init({
  wallets: [injected],
  chains: [
    {
      id: chains.mainnet.id,
      token: chains.mainnet.nativeCurrency.symbol,
      label: chains.mainnet.name,
      rpcUrl: 'https://mainnet.infura.io/v3/ac1bed8fa01947bdb60e2e6cf6cd8206',
    },
    {
      id: chains.base.id,
      token: chains.base.nativeCurrency.symbol,
      label: chains.base.name,
      rpcUrl: 'https://base-mainnet.infura.io/v3/ac1bed8fa01947bdb60e2e6cf6cd8206',
    },
    {
      id: chains.baseSepolia.id,
      token: chains.baseSepolia.nativeCurrency.symbol,
      label: chains.baseSepolia.name,
      rpcUrl: 'https://base-sepolia.infura.io/v3/ac1bed8fa01947bdb60e2e6cf6cd8206',
    },
    {
      id: chains.sepolia.id,
      token: chains.sepolia.nativeCurrency.symbol,
      label: chains.sepolia.name,
      rpcUrl: 'https://sepolia.infura.io/v3/ac1bed8fa01947bdb60e2e6cf6cd8206',
    },
  ],
  appMetadata,
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
});

function MyWeb3OnboardProvider({ children }: { children: React.ReactNode }) {
  return <Web3OnboardProvider web3Onboard={web3Onboard}>{children}</Web3OnboardProvider>;
}

export default MyWeb3OnboardProvider;
