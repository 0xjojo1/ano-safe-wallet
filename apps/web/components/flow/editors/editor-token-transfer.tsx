'use client';

import { TokenTransferNodeData } from '@workspace/types/flow/node';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';

type TokenTransferEditorProps = {
  className?: string;
  data: TokenTransferNodeData;
  onChange: (data: TokenTransferNodeData) => void;
};

export function TokenTransferEditor({ className, data, onChange }: TokenTransferEditorProps) {
  const { recipient = '', token = '', amount = '' } = data;

  return (
    <FieldGroup className={cn('text-xs', className)}>
      <FieldSet className='px-4'>
        <FieldLegend className='!text-xs mb-4'>Transfer Details</FieldLegend>
        <FieldGroup className='gap-3'>
          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Recipient</FieldLabel>
            <Input
              value={recipient}
              onChange={(e) =>
                onChange({
                  ...data,
                  recipient: e.target.value,
                })
              }
              placeholder='0x...'
              className='h-8 !text-xs font-mono'
            />
          </Field>

          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Token</FieldLabel>
            <Select
              value={token}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  token: value,
                })
              }
            >
              <SelectTrigger className='h-8 text-xs'>
                <SelectValue placeholder='Select a token' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ETH' className='text-xs'>
                  ETH
                </SelectItem>
                <SelectItem value='USDC' className='text-xs'>
                  USDC
                </SelectItem>
                <SelectItem value='USDT' className='text-xs'>
                  USDT
                </SelectItem>
                <SelectItem value='DAI' className='text-xs'>
                  DAI
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Amount</FieldLabel>
            <Input
              type='number'
              min='0'
              step='any'
              value={amount}
              onChange={(e) =>
                onChange({
                  ...data,
                  amount: e.target.value,
                })
              }
              placeholder='0.0'
              className='h-8 !text-xs'
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
