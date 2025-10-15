'use client';

import { useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { ArrowRightLeft, Trash2 } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './BaseNode';

type TokenOption = {
  address: string;
  symbol: string;
};

export type TokenTransferForm = {
  recipient: string;
  tokenAddress: string;
  amount: string;
};

export function TokenTransferNode({
  tokens = [],
  initial,
  onSubmit,
  onRemove,
  nodeId,
  className,
}: {
  tokens?: TokenOption[];
  initial?: Partial<TokenTransferForm>;
  onSubmit?: (data: TokenTransferForm) => void;
  onRemove?: (nodeId?: string) => void;
  nodeId?: string;
  className?: string;
}) {
  const [recipient, setRecipient] = useState(initial?.recipient ?? '');
  const [tokenAddress, setTokenAddress] = useState(initial?.tokenAddress ?? '');
  const [amount, setAmount] = useState(initial?.amount ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!recipient || !tokenAddress || !amount) {
      setError('Please fill in all required fields');
      return;
    }
    if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Amount must be a number greater than 0');
      return;
    }
    onSubmit?.({ recipient, tokenAddress, amount });
  };

  return (
    <div className={cn('w-92', className)}>
      <BaseNode
        accent='#f59e0b'
        title='Token Transfer'
        icon={<ArrowRightLeft className='h-4 w-4' />}
        actions={
          <Button
            size='sm'
            variant='ghost'
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(nodeId);
            }}
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        }
      >
        {/* Recipient on its own row, Token and Amount on the same row */}
        <div className='space-y-3'>
          {/* Recipient - full width */}
          <div className='space-y-1'>
            <Label htmlFor='recipient' className='text-xs text-muted-foreground'>
              Recipient
            </Label>
            <Input
              id='recipient'
              placeholder='0x... or ENS'
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className='h-8 text-sm'
            />
          </div>

          {/* Token and Amount - same row */}
          <div className='grid grid-cols-2 gap-3'>
            {/* Token */}
            <div className='space-y-1'>
              <Label htmlFor='token' className='text-xs text-muted-foreground'>
                Token
              </Label>
              <Select value={tokenAddress} onValueChange={setTokenAddress}>
                <SelectTrigger id='token' className='h-8 text-sm'>
                  <SelectValue placeholder='Choose' />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((t) => (
                    <SelectItem key={t.address} value={t.address}>
                      {t.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Amount */}
            <div className='space-y-1'>
              <Label htmlFor='amount' className='text-xs text-muted-foreground'>
                Amount
              </Label>
              <Input
                id='amount'
                type='number'
                inputMode='decimal'
                placeholder='e.g. 1.5'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='h-8 text-sm'
              />
            </div>
          </div>
        </div>
        {error ? <p className='text-xs text-destructive'>{error}</p> : null}
      </BaseNode>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
