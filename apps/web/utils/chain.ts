import { type Chain, extractChain } from 'viem';
import * as chains from 'viem/chains';

export function extractChainInfo(chainId: number): Chain | undefined {
  if (!chainId || typeof chainId !== 'number') {
    return undefined;
  }

  try {
    return extractChain({
      chains: Object.values(chains),
      id: chainId as any,
    });
  } catch {
    return undefined;
  }
}
