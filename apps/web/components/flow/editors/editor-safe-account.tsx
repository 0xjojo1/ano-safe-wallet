'use client';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import { Button } from '@workspace/ui/components/button';
import { CopyButton } from '@workspace/ui/components/common/copy-button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

type SafeAccountEditorProps = {
  className?: string;
  data: any;
  onChange: (data: any) => void;
  onAddTokenTransfer?: () => void;
  onAddCustomBuild?: () => void;
};

export function SafeAccountEditor({
  className,
  data,
  onChange,
  onAddTokenTransfer,
  onAddCustomBuild,
}: SafeAccountEditorProps) {
  const safeInfo = data.safeInfo as SafeAccountInfo;

  return (
    <FieldGroup className={cn(className)}>
      <FieldSet className='px-4'>
        <FieldLegend>Properties</FieldLegend>
        <FieldGroup className='gap-4 text-xs'>
          <Field className='gap-2'>
            <FieldLabel className='text-muted-foreground'>Alias</FieldLabel>
            <Input
              value={safeInfo.alias || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  safeInfo: { ...safeInfo, alias: e.target.value },
                })
              }
              placeholder='Enter your Safe Account alias'
            />
          </Field>

          <Field>
            <FieldLabel className='text-muted-foreground'>Address</FieldLabel>
            <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono break-all'>
              {safeInfo.address}
              <CopyButton className='h-6 w-6' iconClassName='size-3' text={safeInfo.address} />
            </div>
          </Field>

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel className='text-muted-foreground'>Threshold</FieldLabel>
              <div className='bg-muted px-3 py-2 rounded-md text-sm'>
                {safeInfo.threshold} / {safeInfo.owners.length}
              </div>
            </Field>
            <Field>
              <FieldLabel className='text-muted-foreground'>Nonce</FieldLabel>
              <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono'>{safeInfo.nonce}</div>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet className='px-4'>
        <FieldLegend>Actions</FieldLegend>
        <FieldGroup>
          <Field>
            <Button onClick={onAddTokenTransfer}>Token Transfer</Button>
          </Field>
          <Field>
            <Button onClick={onAddCustomBuild}>Custom Build</Button>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet className='px-4'>
        <FieldLegend>Transactions</FieldLegend>
        <FieldGroup className='gap-4 text-xs'>
          <Field className='gap-2'>
            <FieldLabel className='text-muted-foreground'>Alias</FieldLabel>
            <Input
              value={safeInfo.alias || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  safeInfo: { ...safeInfo, alias: e.target.value },
                })
              }
              placeholder='Enter your Safe Account alias'
            />
          </Field>

          <Field>
            <FieldLabel className='text-muted-foreground'>Address</FieldLabel>
            <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono break-all'>
              {safeInfo.address}
              <CopyButton className='h-6 w-6' iconClassName='size-3' text={safeInfo.address} />
            </div>
          </Field>

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel className='text-muted-foreground'>Threshold</FieldLabel>
              <div className='bg-muted px-3 py-2 rounded-md text-sm'>
                {safeInfo.threshold} / {safeInfo.owners.length}
              </div>
            </Field>
            <Field>
              <FieldLabel className='text-muted-foreground'>Nonce</FieldLabel>
              <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono'>{safeInfo.nonce}</div>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
