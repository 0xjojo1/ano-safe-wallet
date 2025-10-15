'use client';

import * as React from 'react';

import {
  ArrowLeftRightIcon,
  Bell,
  Cable,
  Check,
  Copy,
  CreditCard,
  LogOut,
  MoreVertical,
  Network,
  UserCircle,
  Wallet,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Label } from '@workspace/ui/components/label';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';

export function NavUser({
  address,
  walletName,
  handleSwitchWallet,
  chainId,
  chainName,
  disconnect,
}: {
  address: string;
  walletName: string;
  handleSwitchWallet: () => void;
  chainId: number;
  chainName: string;
  disconnect: () => void;
}) {
  const { isMobile } = useSidebar();
  const [copied, setCopied] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitch = () => {
    setDropdownOpen(false);
    handleSwitchWallet();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarImage src={''} alt={address} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{address}</span>
                <span className='text-muted-foreground truncate text-xs'>{chainName}</span>
              </div>
              <MoreVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={''} alt={address} />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight min-w-0'>
                    <div className='flex items-center gap-1.5'>
                      <span className='truncate font-medium'>{address}</span>
                      <button
                        onClick={handleCopy}
                        className='flex-shrink-0 p-0.5 rounded hover:bg-muted transition-colors'
                        title='Copy address'
                      >
                        {copied ? (
                          <Check className='h-3 w-3 text-green-500' />
                        ) : (
                          <Copy className='h-3 w-3 text-muted-foreground' />
                        )}
                      </button>
                    </div>
                    <span className='text-muted-foreground truncate text-xs'>
                      {walletName} / {chainName}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSwitchWallet()}>
              <ArrowLeftRightIcon />
              Switch Wallet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
