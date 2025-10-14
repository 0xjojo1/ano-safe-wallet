import * as React from 'react';
import {
  NetworkEthereum,
  NetworkPolygon,
  NetworkArbitrumOne,
  NetworkOptimism,
  NetworkBase,
  NetworkBinanceSmartChain,
  NetworkAvalanche,
  NetworkGnosis,
  NetworkPolygonZkevm,
  NetworkBerachain,
  NetworkHemi,
  NetworkLinea,
  NetworkCelo,
  NetworkMantle,
  NetworkScroll,
  NetworkZksync,
  NetworkAurora,
  NetworkSonic,
  NetworkInk,
  NetworkUnichain,
} from '@web3icons/react';

/**
 * Get network icon component based on chain ID
 * @param chainId - The chain ID (from wagmi)
 * @param variant - Icon variant style
 * @param size - Icon size in pixels
 * @param color - Optional color override
 */
export function NetworkIcon({
  chainId,
  variant = 'branded',
  size = 24,
  color,
}: {
  chainId: number | null | undefined;
  variant?: 'branded' | 'mono' | 'background';
  size?: number;
  color?: string;
}): React.ReactElement | null {
  if (!chainId) return null;

  // Map chain IDs to their respective icon components
  switch (chainId) {
    // Ethereum Mainnet
    case 1:
      return <NetworkEthereum variant={variant} size={size} color={color} />;

    // Optimism
    case 10:
      return <NetworkOptimism variant={variant} size={size} color={color} />;

    // BNB Smart Chain
    case 56:
      return <NetworkBinanceSmartChain variant={variant} size={size} color={color} />;

    // Gnosis
    case 100:
      return <NetworkGnosis variant={variant} size={size} color={color} />;

    // Unichain
    case 130:
      return <NetworkUnichain variant={variant} size={size} color={color} />;

    // Polygon
    case 137:
      return <NetworkPolygon variant={variant} size={size} color={color} />;

    // Sonic
    case 146:
      return <NetworkSonic variant={variant} size={size} color={color} />;

    // zkSync Era
    case 324:
      return <NetworkZksync variant={variant} size={size} color={color} />;

    // Polygon zkEVM
    case 1101:
      return <NetworkPolygonZkevm variant={variant} size={size} color={color} />;

    // Mantle
    case 5000:
      return <NetworkMantle variant={variant} size={size} color={color} />;

    // Base
    case 8453:
      return <NetworkBase variant={variant} size={size} color={color} />;

    // Arbitrum One
    case 42161:
      return <NetworkArbitrumOne variant={variant} size={size} color={color} />;

    // Celo
    case 42220:
      return <NetworkCelo variant={variant} size={size} color={color} />;

    // Hemi
    case 43111:
      return <NetworkHemi variant={variant} size={size} color={color} />;

    // Avalanche
    case 43114:
      return <NetworkAvalanche variant={variant} size={size} color={color} />;

    // Ink
    case 57073:
      return <NetworkInk variant={variant} size={size} color={color} />;

    // Linea
    case 59144:
      return <NetworkLinea variant={variant} size={size} color={color} />;

    // Berachain
    case 80094:
      return <NetworkBerachain variant={variant} size={size} color={color} />;

    // Base Sepolia (testnet)
    case 84532:
      return <NetworkBase variant={variant} size={size} color={color} />;

    // Scroll
    case 534352:
      return <NetworkScroll variant={variant} size={size} color={color} />;

    // Sepolia (Ethereum testnet)
    case 11155111:
      return <NetworkEthereum variant={variant} size={size} color={color} />;

    // Aurora
    case 1313161554:
      return <NetworkAurora variant={variant} size={size} color={color} />;

    default:
      return null;
  }
}
