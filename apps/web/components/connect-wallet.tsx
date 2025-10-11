'use client';

import { useConnectWallet } from '@web3-onboard/react';
import { Button } from '@workspace/ui/components/button';

import { LogIn } from 'lucide-react';

export default function ConnectWallet({ size = 'default' }: { size?: 'minimal' | 'default' }) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const buttonText = wallet ? 'Disconnect' : 'Connect';

  return (
    <Button
      disabled={connecting}
      onClick={() => (wallet ? disconnect(wallet) : connect())}
      size='sm'
      className='w-full'
    >
      <LogIn />
      {size !== 'minimal' && <span>{buttonText}</span>}
    </Button>
  );
}
