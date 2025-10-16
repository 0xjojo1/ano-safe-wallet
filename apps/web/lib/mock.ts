import { SafeAccountInfo } from '@workspace/types/safe/account';

export const mockSafeInfo: SafeAccountInfo = {
  alias: 'Common Wallet',
  chainId: 1,
  chainName: 'Ethereum Mainnet',
  address: '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
  nonce: '5',
  threshold: 2,
  owners: [
    '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
    '0x1234567890123456789012345678901234567890',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  ],
  singleton: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
  modules: ['0x9999999999999999999999999999999999999999'],
  fallbackHandler: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  guard: '0x0000000000000000000000000000000000000000',
  version: '1.4.1+L2',
};
