'use client';

import { OwnerNodeData } from '@workspace/types/flow/node';
import { CopyButton } from '@workspace/ui/components/common/copy-button';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

type OwnerEditorProps = {
  className?: string;
  data: OwnerNodeData;
  onChange: (data: OwnerNodeData) => void;
};

export function OwnerEditor({ className, data, onChange }: OwnerEditorProps) {
  const { address, alias } = data;

  return (
    <FieldGroup className={cn('text-xs', className)}>
      <FieldSet className='px-4'>
        <FieldLegend className='!text-xs mb-4'>Properties</FieldLegend>
        <FieldGroup className='gap-3'>
          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Alias</FieldLabel>
            <Input
              value={alias || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  alias: e.target.value,
                })
              }
              placeholder='Enter owner alias'
              className='h-8 !text-xs'
            />
          </Field>

          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Address</FieldLabel>
            <div className='bg-muted px-2 py-1.5 rounded-md text-xs font-mono break-all flex items-center justify-between gap-2'>
              <span>{address}</span>
              <CopyButton className='h-5 w-5' iconClassName='size-2.5' text={address} />
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}
