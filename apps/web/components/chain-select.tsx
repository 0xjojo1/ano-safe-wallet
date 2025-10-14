'use client';

import { useConnectWallet, useSetChain } from '@web3-onboard/react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';

import { NetworkIcon } from '@workspace/ui/components/web3/network-icon';

export function ChainSelect() {
  const [{ wallet }] = useConnectWallet();
  const [{ connectedChain, chains }, setChain] = useSetChain();

  if (!wallet) return null;

  const currentChain = chains.find((chain) => chain.id === connectedChain?.id);

  const handleChainChange = async (chainId: string) => {
    await setChain({ chainId });
  };

  return (
    <div className=''>
      <Select value={connectedChain?.id} onValueChange={handleChainChange}>
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder='Select a chain' asChild>
            <div className='flex items-center gap-2 min-w-0'>
              {currentChain?.id && <NetworkIcon chainId={parseInt(currentChain?.id)} variant='mono' />}
              <span className='truncate'>{currentChain?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {chains.map((chain) => (
              <SelectItem key={chain.id} value={chain.id}>
                <NetworkIcon chainId={parseInt(chain.id)} variant='mono' />
                {chain.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
