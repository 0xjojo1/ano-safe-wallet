'use client';

import { useMemo } from 'react';

import { Handle, Position } from '@xyflow/react';
import { Hammer } from 'lucide-react';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

import { BaseNode } from './node-base';

type ABIFunction = {
  name: string;
  type: string;
  inputs: Array<{
    name: string;
    type: string;
    internalType?: string;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
  }>;
  stateMutability?: string;
};

export type CustomBuildNodeProps = {
  className?: string;
  nodeId?: string;
  selected?: boolean;
  contractAddress?: string;
  abiInput?: string;
  parsedAbi?: ABIFunction[];
  selectedFunction?: string;
  functionParams?: Record<string, string>;
  parseError?: string;
  onChange?: (data: {
    contractAddress?: string;
    abiInput?: string;
    parsedAbi?: ABIFunction[];
    selectedFunction?: string;
    functionParams?: Record<string, string>;
    parseError?: string;
  }) => void;
};

export function CustomBuildNode({
  className,
  nodeId,
  selected,
  contractAddress = '',
  abiInput = '',
  parsedAbi = [],
  selectedFunction = '',
  functionParams = {},
  parseError = '',
  onChange,
}: CustomBuildNodeProps) {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ contractAddress: e.target.value });
  };

  const handleAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.({ abiInput: e.target.value });
  };

  const handleParseAbi = () => {
    try {
      const parsed = JSON.parse(abiInput);
      const functions = Array.isArray(parsed) ? parsed.filter((item: any) => item.type === 'function') : [];

      if (functions.length === 0) {
        onChange?.({ parsedAbi: [], parseError: 'No functions found in ABI' });
      } else {
        onChange?.({ parsedAbi: functions, parseError: '' });
      }
    } catch (error) {
      onChange?.({ parsedAbi: [], parseError: 'Invalid JSON format' });
    }
  };

  const handleFunctionChange = (value: string) => {
    onChange?.({ selectedFunction: value, functionParams: {} });
  };

  const handleParamChange = (paramName: string, value: string) => {
    onChange?.({
      functionParams: {
        ...functionParams,
        [paramName]: value,
      },
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const selectedFunctionDetails = useMemo(() => {
    return parsedAbi.find((f) => f.name === selectedFunction);
  }, [parsedAbi, selectedFunction]);

  return (
    <div className={cn('relative group transition-all duration-200', className)}>
      <BaseNode
        accent='#f97316'
        title='Custom Build'
        icon={<Hammer className='h-4 w-4 text-[#f97316]' />}
        className={cn(selected ? 'duration-300 shadow-lg shadow-[#f97316]/50 ease-in-out' : '')}
      >
        <ScrollArea className='max-h-96'>
          <div className='py-2 space-y-3 pr-3'>
            <FieldGroup>
              <FieldSet className='gap-4'>
                {/* Contract Address/ENS Field */}
                <Field className='gap-2'>
                  <FieldLabel htmlFor={`contract-address-${nodeId || 'default'}`} className='text-xs'>
                    Contract Address / ENS
                  </FieldLabel>
                  <Input
                    id={`contract-address-${nodeId || 'default'}`}
                    className='text-xs'
                    placeholder='0x... or name.eth'
                    value={contractAddress}
                    onChange={handleAddressChange}
                    onMouseDown={handleMouseDown}
                    onPointerDown={handlePointerDown}
                  />
                </Field>

                {/* ABI TextArea Field */}
                <Field className='gap-2'>
                  <FieldLabel htmlFor={`abi-input-${nodeId || 'default'}`} className='text-xs'>
                    <span>Contract ABI (JSON)</span>
                  </FieldLabel>
                  <Textarea
                    id={`abi-input-${nodeId || 'default'}`}
                    className='text-xs font-mono'
                    placeholder='Paste ABI JSON here...'
                    rows={6}
                    value={abiInput}
                    onChange={handleAbiChange}
                    onMouseDown={handleMouseDown}
                    onPointerDown={handlePointerDown}
                    onMouseDownCapture={handleMouseDown}
                  />
                  <Button
                    type='button'
                    size='sm'
                    onClick={handleParseAbi}
                    onMouseDown={handleMouseDown}
                    onPointerDown={handlePointerDown}
                    className='w-full text-xs'
                  >
                    Parse ABI
                  </Button>
                </Field>

                {/* Error Alert */}
                {parseError && (
                  <Alert variant='destructive'>
                    <AlertDescription className='text-xs'>{parseError}</AlertDescription>
                  </Alert>
                )}

                {/* Function Select */}
                {parsedAbi.length > 0 && (
                  <Field className='gap-2'>
                    <FieldLabel htmlFor={`function-select-${nodeId || 'default'}`} className='text-xs'>
                      Function
                    </FieldLabel>
                    <Select value={selectedFunction} onValueChange={handleFunctionChange}>
                      <SelectTrigger
                        className='text-xs'
                        onMouseDown={handleMouseDown}
                        onPointerDown={handlePointerDown}
                      >
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
                )}

                {/* Dynamic Parameter Fields */}
                {selectedFunctionDetails && selectedFunctionDetails.inputs.length > 0 && (
                  <>
                    <div className='text-xs font-medium pt-2'>Parameters</div>
                    {selectedFunctionDetails.inputs.map((input, index) => (
                      <Field key={index} className='gap-2'>
                        <FieldLabel htmlFor={`param-${input.name}-${nodeId || 'default'}`} className='text-xs'>
                          {input.name || `param${index}`} ({input.type})
                        </FieldLabel>
                        <Input
                          id={`param-${input.name}-${nodeId || 'default'}`}
                          className='text-xs'
                          placeholder={`Enter ${input.type}`}
                          value={functionParams[input.name] || ''}
                          onChange={(e) => handleParamChange(input.name, e.target.value)}
                          onMouseDown={handleMouseDown}
                          onPointerDown={handlePointerDown}
                        />
                      </Field>
                    ))}
                  </>
                )}
              </FieldSet>
            </FieldGroup>
          </div>
        </ScrollArea>
      </BaseNode>

      <Handle type='target' position={Position.Left} />
    </div>
  );
}
