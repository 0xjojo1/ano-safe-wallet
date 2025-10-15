'use client';

import { Download, Plus, Search, Trash2, Upload } from 'lucide-react';

import { ContactCategory } from '@workspace/types/addressbook/contact';
import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

import { ContactFilters } from '@/hooks/use-address-book';

interface Chain {
  id: string;
  label?: string;
}

interface ContactToolbarProps {
  // Filter props
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  // Data props
  chains: Chain[];
  // Action props
  selectedCount: number;
  onAdd: () => void;
  onImport: () => void;
  onExport: () => void;
  onBatchDelete: () => void;
}

export function ContactToolbar({
  filters,
  onFiltersChange,
  chains,
  selectedCount,
  onAdd,
  onImport,
  onExport,
  onBatchDelete,
}: ContactToolbarProps) {
  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
      {/* Left: Filters */}
      <div className='flex items-center gap-2 flex-1 w-full sm:w-auto'>
        {/* Search */}
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by address or alias...'
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className='pl-9'
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === 'all' ? undefined : (value as ContactCategory),
            })
          }
        >
          <SelectTrigger className='w-[130px]'>
            <SelectValue placeholder='All Types' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Types</SelectItem>
            {Object.values(ContactCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chain Filter */}
        <Select
          value={filters.chainId?.toString() || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              chainId: value === 'all' ? undefined : parseInt(value),
            })
          }
        >
          <SelectTrigger className='w-[130px]'>
            <SelectValue placeholder='All Chains' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Chains</SelectItem>
            {chains.map((chain) => (
              <SelectItem key={chain.id} value={chain.id}>
                {chain.label || `Chain ${chain.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: Action Buttons */}
      <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
        {selectedCount > 0 && (
          <Button variant='destructive' size='sm' onClick={onBatchDelete} className='gap-2'>
            <Trash2 className='h-4 w-4' />
            <span className='hidden sm:inline'>Delete ({selectedCount})</span>
            <span className='sm:hidden'>({selectedCount})</span>
          </Button>
        )}

        <ButtonGroup>
          <Button variant='outline' size='sm' onClick={onImport} className='gap-2'>
            <Upload className='h-4 w-4' />
            <span className='hidden md:inline'>Import</span>
          </Button>
          <Button variant='outline' size='sm' onClick={onExport} className='gap-2'>
            <Download className='h-4 w-4' />
            <span className='hidden md:inline'>Export</span>
          </Button>
        </ButtonGroup>

        <Button onClick={onAdd} size='sm' className='gap-2'>
          <Plus className='h-4 w-4' />
          <span className='hidden md:inline'>Add Contact</span>
        </Button>
      </div>
    </div>
  );
}
