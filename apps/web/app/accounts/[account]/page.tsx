'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { Label } from '@workspace/ui/components/label';
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
import { Copy, Plus, Trash2, Edit, Check, X, Users, Shield, Package } from 'lucide-react';
import { SafeAccountInfo } from '@workspace/types/safe/account';
import { formatAddressShort } from '@/utils/address';
import { isAddress } from 'viem';

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli',
  11155111: 'Sepolia',
  137: 'Polygon',
  80001: 'Mumbai',
  42161: 'Arbitrum One',
  421613: 'Arbitrum Goerli',
  10: 'Optimism',
  420: 'Optimism Goerli',
  8453: 'Base',
  84531: 'Base Goerli',
  100: 'Gnosis Chain',
};

const mockSafeInfo: SafeAccountInfo = {
  chainId: 1,
  address: '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
  nonce: '5',
  threshold: 2,
  owners: [
    '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
    '0x1234567890123456789012345678901234567890',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  ],
  singleton: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
  modules: ['0x9999999999999999999999999999999999999999'],
  fallbackHandler: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
  guard: '0x0000000000000000000000000000000000000000',
  version: '1.4.1+L2',
};

export default function AccountPage({ params }: { params: Promise<{ account: string }> }) {
  const [safeInfo, setSafeInfo] = useState<SafeAccountInfo>(mockSafeInfo);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [editThresholdValue, setEditThresholdValue] = useState(safeInfo.threshold);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [newModuleAddress, setNewModuleAddress] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

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

  const handleAddModule = () => {
    if (!newModuleAddress.trim()) {
      alert('Please enter module address');
      return;
    }
    if (!isAddress(newModuleAddress)) {
      alert('Invalid Ethereum address');
      return;
    }
    if (safeInfo.modules.some((module) => module.toLowerCase() === newModuleAddress.toLowerCase())) {
      alert('This module already exists');
      return;
    }
    setSafeInfo({
      ...safeInfo,
      modules: [...safeInfo.modules, newModuleAddress],
    });
    setNewModuleAddress('');
  };

  const handleRemoveModule = (address: string) => {
    setSafeInfo({
      ...safeInfo,
      modules: safeInfo.modules.filter((module) => module.toLowerCase() !== address.toLowerCase()),
    });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full max-w-7xl mx-auto'>
      {/* Card 1: Basic Info */}
      <Card className='lg:col-span-1'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Account Address</Label>
            <div className='flex items-center gap-2'>
              <code className='flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all'>
                {safeInfo.address}
              </code>
              <Button
                variant='outline'
                size='icon'
                onClick={() => copyToClipboard(safeInfo.address)}
                className='shrink-0'
              >
                {copied === safeInfo.address ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Current Nonce</Label>
            <div className='text-2xl font-semibold tabular-nums'>{safeInfo.nonce}</div>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Contract Version</Label>
            <div>
              <Badge variant='secondary' className='text-sm px-3 py-1'>
                v{safeInfo.version}
              </Badge>
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Chain</Label>
            <div className='text-base font-medium'>
              {CHAIN_NAMES[safeInfo.chainId] || 'Unknown Chain'} (ID: {safeInfo.chainId})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Signature Configuration */}
      <Card className='md:col-span-2 lg:col-span-2'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Signature Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Threshold Management */}
          <div className='space-y-3'>
            <Label className='text-sm text-muted-foreground'>Required Confirmations</Label>
            {!isEditingThreshold ? (
              <div className='flex items-center gap-3'>
                <div className='text-3xl font-bold tabular-nums'>
                  {safeInfo.threshold} / {safeInfo.owners.length}
                </div>
                <Button variant='outline' size='sm' onClick={handleStartEditThreshold}>
                  <Edit className='h-4 w-4' />
                  Edit Threshold
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  min={1}
                  max={safeInfo.owners.length}
                  value={editThresholdValue}
                  onChange={(e) => setEditThresholdValue(Number(e.target.value))}
                  className='w-24'
                />
                <span className='text-muted-foreground'>/ {safeInfo.owners.length}</span>
                <Button size='sm' onClick={handleSaveThreshold}>
                  <Check className='h-4 w-4' />
                  Save
                </Button>
                <Button size='sm' variant='outline' onClick={handleCancelEditThreshold}>
                  <X className='h-4 w-4' />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Owner List */}
          <div className='space-y-3'>
            <Label className='text-sm text-muted-foreground'>Owners</Label>
            <div className='space-y-2'>
              {safeInfo.owners.map((owner, index) => (
                <div
                  key={owner}
                  className='flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors'
                >
                  <span className='text-sm text-muted-foreground w-6'>{index + 1}.</span>
                  <code className='flex-1 text-sm font-mono break-all'>{owner}</code>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 shrink-0'
                    onClick={() => copyToClipboard(owner)}
                  >
                    {copied === owner ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8 shrink-0 text-destructive'>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Owner?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this owner? This will reduce the number of available signers.
                          <br />
                          <code className='text-xs font-mono bg-muted px-2 py-1 rounded mt-2 inline-block'>
                            {owner}
                          </code>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveOwner(owner)}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>

          {/* Add Owner */}
          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Add New Owner</Label>
            <div className='flex gap-2'>
              <Input
                placeholder='0x...'
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                className='flex-1 font-mono'
              />
              <Button onClick={handleAddOwner}>
                <Plus className='h-4 w-4' />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Modules */}
      <Card className='md:col-span-2 lg:col-span-3'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Modules
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {safeInfo.modules.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <Package className='h-12 w-12 mx-auto mb-2 opacity-50' />
              <p>No modules enabled</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {safeInfo.modules.map((module, index) => (
                <div
                  key={module}
                  className='flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors'
                >
                  <span className='text-sm text-muted-foreground w-6'>{index + 1}.</span>
                  <code className='flex-1 text-sm font-mono break-all'>{module}</code>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 shrink-0'
                    onClick={() => copyToClipboard(module)}
                  >
                    {copied === module ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8 shrink-0 text-destructive'>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Module?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this module?
                          <br />
                          <code className='text-xs font-mono bg-muted px-2 py-1 rounded mt-2 inline-block'>
                            {module}
                          </code>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveModule(module)}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}

          {/* Add Module */}
          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Add New Module</Label>
            <div className='flex gap-2'>
              <Input
                placeholder='0x...'
                value={newModuleAddress}
                onChange={(e) => setNewModuleAddress(e.target.value)}
                className='flex-1 font-mono'
              />
              <Button onClick={handleAddModule}>
                <Plus className='h-4 w-4' />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
