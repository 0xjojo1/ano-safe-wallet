'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeftRight, BadgeCheckIcon, Plus, WalletMinimal } from 'lucide-react';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { SafeSimpleItem } from '@workspace/ui/components/safe/safe-simple-item';
import { SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';

import { formatAddressShort } from '@/utils/address';

interface NavSafeSelectProps {
  safeAccounts: SafeAccountInfo[];
  currentAccount: string;
  onSelectAccount: (account: string) => void;
}

export function NavSafeSelect({ safeAccounts, currentAccount, onSelectAccount }: NavSafeSelectProps) {
  const router = useRouter();
  //   if (!safeAccounts || safeAccounts.length === 0) {
  //     return <EmptyState />;
  //   }

  function handleAccountDetails() {
    router.push(`/accounts/${currentAccount}`);
  }

  return (
    <SidebarGroupContent className='flex flex-col gap-2'>
      <SidebarMenu>
        <SidebarMenuItem className='flex items-center gap-2'>
          <SidebarMenuButton
            asChild
            className='relative bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
            onClick={() => handleAccountDetails()}
          >
            <a href='#'>
              <WalletMinimal />
              <span>{formatAddressShort(currentAccount, 0, 6)}</span>
              <Badge variant='default' className='absolute left-0 -bottom-5 text-xs z-99'>
                current
              </Badge>
            </a>
          </SidebarMenuButton>
          <SafeAccountsSelectDialog
            safeAccounts={safeAccounts}
            currentAccount={currentAccount}
            onSelectAccount={onSelectAccount}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  );
}

function EmptyState() {
  return (
    <SidebarGroupContent className='flex flex-col gap-2'>
      <SidebarMenu>
        <SidebarMenuItem className='flex items-center gap-2'>
          <SidebarMenuButton
            tooltip='Quick Create'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
          >
            <span>No Safe Accounts</span>
          </SidebarMenuButton>
          <Button size='icon' className='size-8 group-data-[collapsible=icon]:opacity-0' variant='outline'>
            <Plus />
            <span className='sr-only'>Add Safe Account</span>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  );
}

function SafeAccountsSelectDialog({ safeAccounts, currentAccount, onSelectAccount }: NavSafeSelectProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' className='size-8 group-data-[collapsible=icon]:opacity-0' variant='outline'>
          <ArrowLeftRight />
          <span className='sr-only'>Inbox</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Safe Accounts</DialogTitle>
          <DialogDescription>Select a safe account to use.</DialogDescription>
        </DialogHeader>

        {safeAccounts.map((safeAccount) => (
          <SafeSimpleItem key={safeAccount.address} {...safeAccount} chainId='Ethereum' alias='Life Wallet' />
        ))}
      </DialogContent>
    </Dialog>
  );
}
