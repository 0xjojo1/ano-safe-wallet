import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

export interface CopyButtonProps {
  className?: string;
  text: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Button variant='ghost' size='icon' onClick={() => copyToClipboard(text)} className={cn(className, 'shrink-0')}>
      {copied === text ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
    </Button>
  );
}
