'use client';

import * as React from 'react';

import { Circle, CircleCheck, Copy, Grid3x3, List, Tag, Users } from 'lucide-react';

import { AddressBook } from '@workspace/types/addressbook/contact';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

export interface SafeSimpleItemProps {
  chainId: string;
  address: string;
  threshold: number;
  owners: string[];
  version: string;
  onSelect?: () => void;
  isActive?: boolean;
  className?: string;
  addressbook?: AddressBook;
}

export function SafeSimpleItem({
  chainId,
  address,
  threshold,
  owners,
  version,
  addressbook,
  onSelect,
  isActive = false,
  className,
}: SafeSimpleItemProps) {
  const [copied, setCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'avatar' | 'list'>('avatar');

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOwner = async (e: React.MouseEvent, ownerAddress: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(ownerAddress);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const safeAlias = React.useMemo(() => {
    const contact = addressbook?.find((c) => c.address.toLowerCase() === address.toLowerCase());
    return contact?.alias || formatAddress(address);
  }, [address, addressbook]);

  const enrichedOwners = React.useMemo(() => {
    return owners.map((ownerAddress) => {
      const contact = addressbook?.find((c) => c.address.toLowerCase() === ownerAddress.toLowerCase());
      return {
        address: ownerAddress,
        alias: contact?.alias,
        isInAddressBook: !!contact,
      };
    });
  }, [owners, addressbook]);

  const ownerCount = owners.length;

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all duration-200',
        'hover:shadow-md hover:border-primary/50',
        isActive ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card',
        className
      )}
    >
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold flex items-center gap-2'>
          # {safeAlias}
          <Badge variant='outline' className='text-[10px] px-1.5 py-0'>
            v{version}
          </Badge>
        </h3>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={onSelect}
          disabled={isActive}
          title={isActive ? 'Currently active' : 'Select this account'}
        >
          {isActive ? (
            <CircleCheck className='h-4 w-4 text-primary' />
          ) : (
            <Circle className='h-4 w-4 text-muted-foreground' />
          )}
        </Button>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-muted-foreground flex items-center gap-1.5'>
            <Users className='h-3.5 w-3.5' />
            Signers
            <span className='font-semibold text-foreground tabular-nums'>
              ({threshold}/{ownerCount})
            </span>
          </span>
          <Button
            variant='ghost'
            size='sm'
            className='h-5 w-5 p-0 hover:bg-muted'
            onClick={() => setViewMode(viewMode === 'avatar' ? 'list' : 'avatar')}
          >
            {viewMode === 'avatar' ? (
              <List className='h-3.5 w-3.5 text-muted-foreground' />
            ) : (
              <Grid3x3 className='h-3.5 w-3.5 text-muted-foreground' />
            )}
          </Button>
        </div>

        {viewMode === 'avatar' && (
          <div className='flex items-center gap-1.5 flex-wrap'>
            {enrichedOwners.map((owner) => (
              <div key={owner.address} className='relative' title={owner.alias || owner.address}>
                <div
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all',
                    owner.isInAddressBook
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  )}
                >
                  {owner.address.slice(2, 4).toUpperCase()}
                </div>
                {owner.alias && (
                  <div className='absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border border-background' />
                )}
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className='space-y-1'>
            {enrichedOwners.map((owner, idx) => (
              <div
                key={owner.address}
                className='group flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 transition-colors'
              >
                <span className='text-[10px] text-muted-foreground w-4 text-right'>{idx + 1}</span>
                <div className='flex-1 min-w-0'>
                  {owner.alias ? (
                    <div className='flex items-center gap-1 mb-0.5'>
                      <Tag className='h-2.5 w-2.5 text-primary flex-shrink-0' />
                      <span className='text-xs font-medium text-primary truncate'>{owner.alias}</span>
                    </div>
                  ) : null}
                  <code className='text-[10px] text-muted-foreground font-mono block truncate'>{owner.address}</code>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={(e) => handleCopyOwner(e, owner.address)}
                >
                  <Copy className='h-2.5 w-2.5' />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
