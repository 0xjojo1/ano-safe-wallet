'use client';

import { useMemo } from 'react';

import { ABIFunction, CustomBuildNodeData } from '@workspace/types/flow/node';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

type CustomBuildEditorProps = {
  className?: string;
  data: CustomBuildNodeData;
  onChange: (data: CustomBuildNodeData) => void;
};

export function CustomBuildEditor({ className, data, onChange }: CustomBuildEditorProps) {
  const {
    contractAddress = '',
    abiInput = '',
    parsedAbi = [],
    selectedFunction = '',
    functionParams = {},
    parseError = '',
  } = data;

  const handleParseAbi = () => {
    try {
      const parsed = JSON.parse(abiInput);
      const functions = Array.isArray(parsed) ? parsed.filter((item: any) => item.type === 'function') : [];

      if (functions.length === 0) {
        onChange({
          ...data,
          parsedAbi: [],
          parseError: 'No functions found in ABI',
        });
      } else {
        onChange({
          ...data,
          parsedAbi: functions,
          parseError: '',
        });
      }
    } catch (error) {
      onChange({
        ...data,
        parsedAbi: [],
        parseError: 'Invalid JSON format',
      });
    }
  };

  const selectedFunctionDetails = useMemo(() => {
    return parsedAbi.find((f) => f.name === selectedFunction);
  }, [parsedAbi, selectedFunction]);

  return (
    <FieldGroup className={cn('text-xs', className)}>
      <FieldSet className='px-4'>
        <FieldLegend className='!text-xs mb-4'>Contract Information</FieldLegend>
        <FieldGroup className='gap-3'>
          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Contract Address</FieldLabel>
            <Input
              value={contractAddress}
              onChange={(e) =>
                onChange({
                  ...data,
                  contractAddress: e.target.value,
                })
              }
              placeholder='0x...'
              className='h-8 !text-xs font-mono'
            />
          </Field>

          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>ABI JSON</FieldLabel>
            <Textarea
              value={abiInput}
              onChange={(e) =>
                onChange({
                  ...data,
                  abiInput: e.target.value,
                })
              }
              placeholder='Paste contract ABI JSON here...'
              rows={6}
              className='!text-xs font-mono'
            />
          </Field>

          <Button onClick={handleParseAbi} className='h-8 text-xs' size='sm'>
            Parse ABI
          </Button>
        </FieldGroup>
      </FieldSet>

      {parseError && (
        <div className='px-4'>
          <Alert variant='destructive' className='text-xs'>
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        </div>
      )}

      {parsedAbi.length > 0 && !parseError && (
        <FieldSet className='px-4'>
          <FieldLegend className='!text-xs mb-4'>Function Selection</FieldLegend>
          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Function</FieldLabel>
            <Select
              value={selectedFunction}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  selectedFunction: value,
                  functionParams: {},
                })
              }
            >
              <SelectTrigger className='h-8 text-xs'>
                <SelectValue placeholder='Select a function' />
              </SelectTrigger>
              <SelectContent>
                {parsedAbi.map((func) => (
                  <SelectItem key={func.name} value={func.name} className='text-xs'>
                    {func.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldSet>
      )}

      {selectedFunctionDetails && selectedFunctionDetails.inputs && selectedFunctionDetails.inputs.length > 0 && (
        <FieldSet className='px-4'>
          <FieldLegend className='!text-xs mb-4'>Function Parameters</FieldLegend>
          <FieldGroup className='gap-3'>
            {selectedFunctionDetails.inputs.map((param) => (
              <Field key={param.name} className='gap-1'>
                <FieldLabel className='text-muted-foreground text-xs'>
                  {param.name} ({param.type})
                </FieldLabel>
                <Input
                  value={functionParams[param.name] || ''}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      functionParams: {
                        ...functionParams,
                        [param.name]: e.target.value,
                      },
                    })
                  }
                  placeholder={`Enter ${param.type}`}
                  className='h-8 !text-xs font-mono'
                />
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
      )}
    </FieldGroup>
  );
}
