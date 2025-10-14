import {
  TokenETHM,
  TokenPOLY,
  TokenARB,
  TokenOPTI,
  TokenBS,
  TokenICE,
  TokenLAUNCH,
  TokenGNO,
  TokenUSDC,
  TokenUSDT,
  TokenDAI,
  TokenLINK,
  TokenUNI,
  TokenAAVE,
  TokenCRV,
} from '@web3icons/react';

export function getTokenIcon({
  symbol,
  variant,
  size,
}: {
  symbol: string;
  variant: 'branded' | 'mono' | 'background';
  size: number;
}): React.ReactElement | null {
  // Normalize symbol to lowercase for matching
  const normalizedSymbol = symbol.toLowerCase();

  switch (normalizedSymbol) {
    // Native tokens
    case 'eth':
    case 'ethereum':
      return <TokenETHM variant={variant} size={size} />;
    case 'matic':
    case 'polygon':
      return <TokenPOLY variant={variant} size={size} />;
    case 'arb':
    case 'arbitrum':
      return <TokenARB variant={variant} size={size} />;
    case 'op':
    case 'optimism':
      return <TokenOPTI variant={variant} size={size} />;
    case 'base':
      return <TokenBS variant={variant} size={size} />;
    case 'bnb':
    case 'bsc':
    case 'binance':
      return <TokenICE variant={variant} size={size} />;
    case 'avax':
    case 'avalanche':
      return <TokenLAUNCH variant={variant} size={size} />;
    case 'xdai':
    case 'gnosis':
      return <TokenGNO variant={variant} size={size} />;

    // Stablecoins
    case 'usdc':
      return <TokenUSDC variant={variant} size={size} />;
    case 'usdt':
      return <TokenUSDT variant={variant} size={size} />;
    case 'dai':
      return <TokenDAI variant={variant} size={size} />;

    // DeFi tokens
    case 'link':
    case 'chainlink':
      return <TokenLINK variant={variant} size={size} />;
    case 'uni':
    case 'uniswap':
      return <TokenUNI variant={variant} size={size} />;
    case 'aave':
      return <TokenAAVE variant={variant} size={size} />;
    case 'crv':
    case 'curve':
      return <TokenCRV variant={variant} size={size} />;

    // Wrapped tokens
    case 'weth':
      return <TokenETHM variant={variant} size={size} />;
    case 'wmatic':
      return <TokenPOLY variant={variant} size={size} />;

    default:
      return null;
  }
}
