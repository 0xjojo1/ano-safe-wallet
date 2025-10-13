'use client';

import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { Button } from '@workspace/ui/components/button';

import { LogIn } from 'lucide-react';
import { NavUser } from './sidebar/nav/nav-user';
import { extractChainInfo } from '@/utils/chain';
import { formatAddressShort } from '@/utils/address';

export default function ConnectWallet({ size = 'default' }: { size?: 'minimal' | 'default' }) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [connectedChain] = useSetChain();

  let chainInfo;
  if (connectedChain) {
    chainInfo = extractChainInfo(connectedChain.connectedChain?.id ? parseInt(connectedChain.connectedChain.id) : 0);
  }

  if (wallet) {
    return (
      <NavUser
        address={formatAddressShort(wallet.accounts[0]?.address ?? '', 0, 6)}
        chainId={connectedChain.connectedChain?.id ? parseInt(connectedChain.connectedChain.id) : 0}
        chainName={chainInfo?.name ?? ''}
        disconnect={() => disconnect(wallet)}
      />
    );
  }

  return (
    <Button
      disabled={connecting}
      onClick={() => (wallet ? disconnect(wallet) : connect())}
      size='sm'
      className='w-full'
    >
      <LogIn />
      {size !== 'minimal' && <span>Connect</span>}
    </Button>
  );
}
