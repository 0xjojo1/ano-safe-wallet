'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { Check, Edit, Package, Plus, Shield, Trash2, Users, X } from 'lucide-react';
import { isAddress } from 'viem';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { CopyButton } from '@workspace/ui/components/common/copy-button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea, ScrollBar } from '@workspace/ui/components/scroll-area';

import { mockSafeInfo } from '@/lib/mock';

export default function AccountPage() {
  const params = useParams();
  const account = params.account as string;

  const [safeInfo, setSafeInfo] = useState<SafeAccountInfo>(mockSafeInfo);
  const [alias, setAlias] = useState('My Safe Account');
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [editAliasValue, setEditAliasValue] = useState(alias);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [editThresholdValue, setEditThresholdValue] = useState(safeInfo.threshold);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  const handleAddOwner = () => {
    if (!newOwnerAddress.trim()) {
      alert('Please enter an address');
      return;
    }
    if (!isAddress(newOwnerAddress)) {
      alert('Invalid Ethereum address');
      return;
    }
    if (safeInfo.owners.some((owner) => owner.toLowerCase() === newOwnerAddress.toLowerCase())) {
      alert('This owner already exists');
      return;
    }
    setSafeInfo({
      ...safeInfo,
      owners: [...safeInfo.owners, newOwnerAddress],
    });
    setNewOwnerAddress('');
  };

  const handleRemoveOwner = (address: string) => {
    if (safeInfo.owners.length <= 1) {
      alert('At least one owner must remain');
      return;
    }
    if (safeInfo.owners.length - 1 < safeInfo.threshold) {
      alert('Cannot remove: would fall below threshold. Please lower the threshold first.');
      return;
    }
    setSafeInfo({
      ...safeInfo,
      owners: safeInfo.owners.filter((owner) => owner.toLowerCase() !== address.toLowerCase()),
    });
  };

  const handleStartEditAlias = () => {
    setEditAliasValue(alias);
    setIsEditingAlias(true);
  };

  const handleSaveAlias = () => {
    if (!editAliasValue.trim()) {
      alert('Alias cannot be empty');
      return;
    }
    setAlias(editAliasValue);
    setIsEditingAlias(false);
  };

  const handleCancelEditAlias = () => {
    setEditAliasValue(alias);
    setIsEditingAlias(false);
  };

  const handleStartEditThreshold = () => {
    setEditThresholdValue(safeInfo.threshold);
    setIsEditingThreshold(true);
  };

  const handleSaveThreshold = () => {
    if (editThresholdValue < 1 || editThresholdValue > safeInfo.owners.length) {
      alert(`Threshold must be between 1 and ${safeInfo.owners.length}`);
      return;
    }
    setSafeInfo({
      ...safeInfo,
      threshold: editThresholdValue,
    });
    setIsEditingThreshold(false);
  };

  const handleCancelEditThreshold = () => {
    setEditThresholdValue(safeInfo.threshold);
    setIsEditingThreshold(false);
  };

  return (
    <ScrollArea className='w-full h-[calc(100%-72px)] max-w-5xl mx-auto'>
      <div className='px-4'>
        <FieldSet className='md:flex-row '>
          <div className='md:w-64 md:shrink-0'>
            <FieldLegend>Basic Info</FieldLegend>
            <FieldDescription>View and manage account details and contract information.</FieldDescription>
          </div>
          <FieldGroup className='md:flex-1'>
            {/* Editable on demand: Alias */}
            <Field>
              <FieldLabel>Alias</FieldLabel>
              {isEditingAlias ? (
                <div className='flex items-center gap-2'>
                  <Input
                    value={editAliasValue}
                    onChange={(e) => setEditAliasValue(e.target.value)}
                    placeholder='My Safe Account'
                    className='flex-1'
                  />
                  <Button size='icon' variant='ghost' onClick={handleSaveAlias}>
                    <Check className='h-4 w-4' />
                  </Button>
                  <Button size='icon' variant='ghost' onClick={handleCancelEditAlias}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <div className='bg-muted px-3 py-2 rounded-md text-sm flex-1'>{alias}</div>
                  <Button size='icon' variant='ghost' onClick={handleStartEditAlias}>
                    <Edit className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </Field>

            {/* Read-only: Account Address */}
            <Field>
              <FieldLabel>Account Address</FieldLabel>
              <div className='flex items-center gap-2'>
                <code className='flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all'>{account}</code>
                <CopyButton text={account} />
              </div>
            </Field>

            {/* Read-only: Version & Nonce */}
            <div className='grid grid-cols-2 gap-4'>
              <Field>
                <FieldLabel>Contract Version</FieldLabel>
                <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono'>{safeInfo.version}</div>
              </Field>
              <Field>
                <FieldLabel>Current Nonce</FieldLabel>
                <div className='bg-muted px-3 py-2 rounded-md text-sm font-mono'>{safeInfo.nonce}</div>
                <FieldDescription>Increments with each transaction to prevent replay attacks.</FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator className='my-8' />

        <FieldSet className='md:flex-row max-w-5xl mx-auto'>
          {/* Left: Legend & Description */}
          <div className='md:w-64 md:shrink-0'>
            <FieldLegend>Signers</FieldLegend>
            <FieldDescription>
              Control who can approve transactions and adjust the required confirmation threshold.
            </FieldDescription>
          </div>

          {/* Right: Content */}
          <FieldGroup className='md:flex-1'>
            {/* Editable on demand: Threshold */}
            <Field>
              <FieldLabel>Threshold</FieldLabel>
              {isEditingThreshold ? (
                <div className='flex items-center gap-2'>
                  <Input
                    type='number'
                    value={editThresholdValue}
                    onChange={(e) => setEditThresholdValue(parseInt(e.target.value) || 1)}
                    min={1}
                    max={safeInfo.owners.length}
                    className='w-24'
                  />
                  <span className='text-sm text-muted-foreground'>of {safeInfo.owners.length} owner(s)</span>
                  <Button size='icon' variant='ghost' onClick={handleSaveThreshold}>
                    <Check className='h-4 w-4' />
                  </Button>
                  <Button size='icon' variant='ghost' onClick={handleCancelEditThreshold}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <div className='bg-muted px-3 py-2 rounded-md text-sm'>
                    {safeInfo.threshold} of {safeInfo.owners.length} owner(s)
                  </div>
                  <Button size='icon' variant='ghost' onClick={handleStartEditThreshold}>
                    <Edit className='h-4 w-4' />
                  </Button>
                </div>
              )}
              <FieldDescription>How many owners must approve before a transaction can be executed.</FieldDescription>
            </Field>

            <FieldSeparator />

            {/* Owners List */}
            <Field>
              <FieldLabel>Owner Addresses ({safeInfo.owners.length})</FieldLabel>
              <div className='space-y-2'>
                {safeInfo.owners.map((owner, index) => (
                  <div key={owner} className='flex items-center gap-2 p-2 rounded-md border bg-background'>
                    <Badge variant='outline' className='shrink-0'>
                      {index + 1}
                    </Badge>
                    <code className='flex-1 text-xs font-mono text-muted-foreground break-all'>{owner}</code>
                    <CopyButton text={owner} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size='icon' variant='ghost' className='shrink-0'>
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Owner</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this owner? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveOwner(owner)} className='bg-destructive'>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
              <FieldDescription>
                Each owner can propose and approve transactions. Note: You cannot remove owners if it would reduce the
                count below the threshold.
              </FieldDescription>
            </Field>

            {/* Add New Owner */}
            <Field>
              <FieldLabel>Add New Owner</FieldLabel>
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='0x...'
                  value={newOwnerAddress}
                  onChange={(e) => setNewOwnerAddress(e.target.value)}
                  className='flex-1 font-mono'
                />
                <Button onClick={handleAddOwner} className='gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Owner
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className='mb-4' />
      </div>
    </ScrollArea>
  );
}
