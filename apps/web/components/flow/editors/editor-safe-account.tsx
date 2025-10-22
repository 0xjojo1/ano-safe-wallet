'use client';

import { useMemo, useState } from 'react';

import { ArrowRightLeft, ChevronDown, ChevronRight, Code, Eye, Plus, Trash2 } from 'lucide-react';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import { Button } from '@workspace/ui/components/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@workspace/ui/components/collapsible';
import { CopyButton } from '@workspace/ui/components/common/copy-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

import { useTransactionFlow } from '@/contexts/TransactionFlowContext';

type SafeAccountEditorProps = {
  className?: string;
  data: any;
  onChange: (data: any) => void;
};

export function SafeAccountEditor({ className, data, onChange }: SafeAccountEditorProps) {
  const { addTokenTransferNode, addCustomBuildNode, selectedNode, nodes, edges, selectNode, deleteNode } =
    useTransactionFlow();
  const safeInfo = data.safeInfo as SafeAccountInfo;

  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());

  const connectedTransactions = useMemo(() => {
    if (!selectedNode) return [];

    const connectedEdges = edges.filter((e) => e.source === selectedNode.id);
    const transactionNodes = connectedEdges
      .map((edge) => nodes.find((n) => n.id === edge.target))
      .filter((node): node is NonNullable<typeof node> => node !== undefined);

    return transactionNodes;
  }, [selectedNode, nodes, edges]);

  const toggleTransaction = (nodeId: string) => {
    setExpandedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderTransactionDetails = (node: any) => {
    const { type, data } = node;

    if (type === 'tokenTransferNode') {
      return (
        <div className='space-y-2 text-xs pt-2'>
          <div>
            <div className='text-muted-foreground'>Recipient</div>
            <div className='font-mono mt-0.5 break-all'>{data.recipient || '—'}</div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <div className='text-muted-foreground'>Token</div>
              <div className='mt-0.5'>{data.token || '—'}</div>
            </div>
            <div>
              <div className='text-muted-foreground'>Amount</div>
              <div className='mt-0.5'>{data.amount || '—'}</div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'customBuildNode') {
      return (
        <div className='space-y-2 text-xs pt-2'>
          <div>
            <div className='text-muted-foreground'>Contract Address</div>
            <div className='font-mono mt-0.5 break-all'>{data.contractAddress || '—'}</div>
          </div>
          <div>
            <div className='text-muted-foreground'>Function</div>
            <div className='mt-0.5'>{data.selectedFunction || '—'}</div>
          </div>
          {data.functionParams && Object.keys(data.functionParams).length > 0 && (
            <div>
              <div className='text-muted-foreground'>Parameters</div>
              <div className='mt-0.5 space-y-1'>
                {Object.entries(data.functionParams).map(([key, value]) => (
                  <div key={key} className='text-xs'>
                    <span className='text-muted-foreground'>{key}:</span> {(value as string) || '—'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <FieldGroup className={cn('text-xs', className)}>
      <FieldSet className='px-4'>
        <FieldLegend className='!text-xs mb-4'>Properties</FieldLegend>
        <FieldGroup className='gap-3'>
          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Alias</FieldLabel>
            <Input
              value={safeInfo.alias || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  safeInfo: { ...safeInfo, alias: e.target.value },
                })
              }
              placeholder='Enter your Safe Account alias'
              className='h-8 !text-xs'
            />
          </Field>

          <Field className='gap-1'>
            <FieldLabel className='text-muted-foreground text-xs'>Address</FieldLabel>
            <div className='bg-muted px-2 py-1.5 rounded-md text-xs font-mono break-all'>
              {safeInfo.address}
              <CopyButton className='h-5 w-5' iconClassName='size-2.5' text={safeInfo.address} />
            </div>
          </Field>

          <div className='grid grid-cols-2 gap-2'>
            <Field className='gap-1'>
              <FieldLabel className='text-muted-foreground text-xs'>Threshold</FieldLabel>
              <div className='bg-muted px-2 py-1.5 rounded-md text-xs'>
                {safeInfo.threshold} / {safeInfo.owners.length}
              </div>
            </Field>
            <Field className='gap-1'>
              <FieldLabel className='text-muted-foreground text-xs'>Nonce</FieldLabel>
              <div className='bg-muted px-2 py-1.5 rounded-md text-xs font-mono'>{safeInfo.nonce}</div>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator className='h-1' />

      <FieldSet className='px-4'>
        <FieldLegend className='!text-xs mb-4 flex justify-between items-center w-full'>
          <span>Transactions</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost' className='size-6'>
                <Plus className='size-3' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                onClick={() => selectedNode && addTokenTransferNode(selectedNode.id)}
                className='gap-2 text-xs'
              >
                <ArrowRightLeft className='size-4' />
                <span>Token Transfer</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => selectedNode && addCustomBuildNode(selectedNode.id)}
                className='gap-2 text-xs'
              >
                <Code className='size-4' />
                <span>Custom Build</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </FieldLegend>

        {/* Transaction List */}
        {connectedTransactions.length > 0 && (
          <div className='space-y-2 mt-3'>
            {connectedTransactions.map((node, index) => {
              const isExpanded = expandedTransactions.has(node.id);

              return (
                <Collapsible key={node.id} open={isExpanded} onOpenChange={() => toggleTransaction(node.id)}>
                  <div className='border rounded-md overflow-hidden'>
                    <CollapsibleTrigger className='w-full'>
                      <div className='flex items-center justify-between p-2 hover:bg-muted/50 transition-colors'>
                        <div className='flex items-center gap-2 flex-1 min-w-0'>
                          {isExpanded ? (
                            <ChevronDown className='size-3.5 text-muted-foreground flex-shrink-0' />
                          ) : (
                            <ChevronRight className='size-3.5 text-muted-foreground flex-shrink-0' />
                          )}
                          <span className='text-xs text-muted-foreground'>#{index + 1}</span>
                        </div>
                        <div className='flex items-center gap-1 flex-shrink-0'>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='size-6'
                            onClick={(e) => {
                              e.stopPropagation();
                              selectNode(node.id);
                            }}
                          >
                            <Eye className='size-3' />
                          </Button>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='size-6 text-destructive hover:text-destructive'
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                          >
                            <Trash2 className='size-3' />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className='px-3 pb-3 border-t bg-muted/20'>{renderTransactionDetails(node)}</div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}

        {connectedTransactions.length === 0 && (
          <div className='text-xs text-muted-foreground text-center py-4'>No transactions added yet</div>
        )}
      </FieldSet>
    </FieldGroup>
  );
}
