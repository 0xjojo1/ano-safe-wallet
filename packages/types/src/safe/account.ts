export type SafeAccountInfo = {
  chainId: number;
  chainName: string;
  address: string;
  nonce: string;
  threshold: number;
  owners: string[];
  singleton: string;
  modules: string[];
  fallbackHandler: string;
  guard: string;
  version: string;
};
