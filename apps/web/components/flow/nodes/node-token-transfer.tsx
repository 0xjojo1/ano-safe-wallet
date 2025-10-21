import { useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { HandCoins } from 'lucide-react';

import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './node-base';

export type TokenTransferNodeProps = {
  className?: string;
  nodeId?: string;
  selected?: boolean;
};

export function TokenTransferNode(props: TokenTransferNodeProps) {
  const { className, nodeId, selected } = props;

  const [recipient, setRecipient] = useState('');
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState('');

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
  };

  return (
    <div className={cn('relative group transition-all duration-200', className)}>
      <BaseNode
        accent='#f97316'
        icon={<HandCoins className='h-4 w-4 text-[#f97316]' />}
        className={cn(selected ? 'duration-300 shadow-lg shadow-[#f97316]/50 ease-in-out' : '')}
        title='Token Transfer'
      >
        <div className='py-2 space-y-2'>
          <FieldGroup>
            <FieldSet className='gap-4'>
              <Field className='gap-2'>
                <FieldLabel htmlFor={`recipient-${nodeId || 'default'}`} className='text-xs'>
                  Recipient
                </FieldLabel>
                <Input
                  id={`recipient-${nodeId || 'default'}`}
                  className='text-xs'
                  placeholder='0x...'
                  required
                  value={recipient}
                  onChange={handleRecipientChange}
                />
              </Field>
              <Field className='gap-2'>
                <FieldLabel htmlFor={`token-${nodeId || 'default'}`} className='text-xs'>
                  Token
                </FieldLabel>
                <Select value={token} onValueChange={handleTokenChange}>
                  <SelectTrigger className='text-xs'>
                    <SelectValue placeholder='Select a token' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USDC' className='text-xs'>
                      USDC
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field className='gap-2'>
                <FieldLabel htmlFor={`amount-${nodeId || 'default'}`} className='text-xs'>
                  Amount
                </FieldLabel>
                <Input
                  id={`amount-${nodeId || 'default'}`}
                  type='number'
                  min={0}
                  className='text-xs'
                  placeholder='Enter amount'
                  required
                  value={amount}
                  onChange={handleAmountChange}
                />
              </Field>
            </FieldSet>
          </FieldGroup>
        </div>
      </BaseNode>

      <Handle type='target' position={Position.Left} />
    </div>
  );
}
