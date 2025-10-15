'use client';

import { useState } from 'react';

import { Check, Copy, Shield } from 'lucide-react';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';

export interface SafeAccountBasicCardProps {
  className?: string;
  safeInfo: SafeAccountInfo;
}

export function SafeAccountBasicCard({ safeInfo, className }: SafeAccountBasicCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className={cn(className)}>
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
            <code className='flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-md break-all'>{safeInfo.address}</code>
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
          <div className='text-base font-medium'>{safeInfo.chainName}</div>
        </div>
      </CardContent>
    </Card>
  );
}
