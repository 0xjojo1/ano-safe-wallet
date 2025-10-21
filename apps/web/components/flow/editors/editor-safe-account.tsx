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

type SafeAccountEditorProps = {
  data: any;
  onChange: (data: any) => void;
  onAddTokenTransfer?: () => void;
  onAddCustomBuild?: () => void;
};

export function SafeAccountEditor({ data, onChange, onAddTokenTransfer, onAddCustomBuild }: SafeAccountEditorProps) {
  const safeInfo = data.safeInfo as SafeAccountInfo;

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Properties</FieldLegend>
        <FieldGroup>
          <Field>
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
            <FieldLabel>Address</FieldLabel>
            <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono break-all'>
              {safeInfo.address}
              <CopyButton className='h-6 w-6' iconClassName='size-3' text={safeInfo.address} />
            </div>
          </Field>

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel>Threshold</FieldLabel>
              <div className='bg-muted px-3 py-2 rounded-md text-sm'>
                {safeInfo.threshold} / {safeInfo.owners.length}
              </div>
            </Field>
            <Field>
              <FieldLabel>Nonce</FieldLabel>
              <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono'>{safeInfo.nonce}</div>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
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
    </FieldGroup>
  );
}
