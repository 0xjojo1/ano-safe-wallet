'use client';

import * as React from 'react';

import { Check, Copy, Edit, Trash2 } from 'lucide-react';

import { Contact, ContactCategory } from '@workspace/types/addressbook/contact';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { NetworkIcon } from '@workspace/ui/components/web3/network-icon';

interface ContactTableProps {
  contacts: Contact[];
  selectedContacts: string[];
  onSelect: (address: string) => void;
  onSelectAll: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  isSelected: (address: string) => boolean;
}

export function ContactTable({
  contacts,
  selectedContacts,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  isSelected,
}: ContactTableProps) {
  const [copiedAddress, setCopiedAddress] = React.useState<string | null>(null);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;
  const someSelected = selectedContacts.length > 0 && selectedContacts.length < contacts.length;

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>
              <Checkbox
                checked={allSelected || someSelected}
                onCheckedChange={onSelectAll}
                className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
              />
            </TableHead>
            <TableHead>Alias</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Chain</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className='w-[100px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No contacts found.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.address}>
                <TableCell>
                  <Checkbox checked={isSelected(contact.address)} onCheckedChange={() => onSelect(contact.address)} />
                </TableCell>
                <TableCell className='font-medium'>{contact.alias}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {/* Truncated address on small screens */}
                    <code className='text-xs font-mono text-muted-foreground xl:hidden'>
                      {contact.address.slice(0, 6)}...{contact.address.slice(-4)}
                    </code>
                    {/* Full address on large screens */}
                    <code className='hidden xl:inline text-xs font-mono text-muted-foreground'>{contact.address}</code>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 w-6 p-0'
                      onClick={() => handleCopy(contact.address)}
                    >
                      {copiedAddress === contact.address ? (
                        <Check className='h-3 w-3 text-green-500' />
                      ) : (
                        <Copy className='h-3 w-3 text-muted-foreground' />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={contact.category === ContactCategory.SAFE ? 'default' : 'secondary'}>
                    {contact.category === ContactCategory.SAFE ? 'Safe' : 'Account'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {contact.chainId ? (
                    <div className='flex items-center gap-1.5'>
                      <NetworkIcon chainId={contact.chainId} variant='mono' size={16} />
                      <span className='text-xs'>Chain {contact.chainId}</span>
                    </div>
                  ) : (
                    <span className='text-xs text-muted-foreground'>—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className='text-xs text-muted-foreground truncate max-w-[200px] block'>
                    {contact.note || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Button variant='ghost' size='sm' className='h-7 w-7 p-0' onClick={() => onEdit(contact)}>
                      <Edit className='h-3.5 w-3.5' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 w-7 p-0 text-destructive hover:text-destructive'
                      onClick={() => onDelete(contact)}
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
