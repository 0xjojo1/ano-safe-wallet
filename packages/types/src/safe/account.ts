export type SafeAccountInfo = {
  chainId: number;
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
