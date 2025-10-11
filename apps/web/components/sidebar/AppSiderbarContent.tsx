'use client';

import { Button } from '@workspace/ui/components/button';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenu,
  SidebarGroupContent,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { ArrowLeftRight, Coins, Gauge, HelpCircle, ListTodoIcon, Plus, Search, Settings, Wallet } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const baseItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Gauge,
  },
  {
    title: 'Accounts',
    url: '/wallets',
    icon: Wallet,
  },
  {
    title: 'Assets',
    url: '/assets',
    icon: Coins,
  },
];

const transactionItems = [
  {
    title: 'New Transaction',
    url: '/transactions/new',
    icon: Plus,
  },
  {
    title: 'Queue',
    url: '/transactions/queue',
    icon: ListTodoIcon,
  },
  {
    title: 'History',
    url: '/transactions/history',
    icon: ArrowLeftRight,
  },
];

const bottomItems = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Get Help',
    url: '/help',
    icon: HelpCircle,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
];

export function AppSidebarContent({ showAccountsSelect = false }: { showAccountsSelect?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarContent className='flex flex-col justify-between'>
      <div>
        {showAccountsSelect && (
          <SidebarGroup>
            <SidebarGroupContent className='flex flex-col gap-2'>
              <SidebarMenu>
                <SidebarMenuItem className='flex items-center gap-2'>
                  <SidebarMenuButton
                    tooltip='Quick Create'
                    className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
                  >
                    <span>Quick Create</span>
                  </SidebarMenuButton>
                  <Button size='icon' className='size-8 group-data-[collapsible=icon]:opacity-0' variant='outline'>
                    <ArrowLeftRight />
                    <span className='sr-only'>Inbox</span>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent className='cursor-pointer'>
            <SidebarMenu>
              {baseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={state === 'collapsed' ? item.title : undefined}
                    asChild
                    isActive={pathname === item.url}
                    onClick={() => router.push(item.url)}
                  >
                    <a>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Transactions</SidebarGroupLabel>
          <SidebarGroupContent className='cursor-pointer'>
            <SidebarMenu>
              {transactionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={state === 'collapsed' ? item.title : undefined}
                    asChild
                    isActive={pathname === item.url}
                    onClick={() => router.push(item.url)}
                  >
                    <a>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SafeWalletGroup /> */}
      </div>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={state === 'collapsed' ? item.title : undefined}
                  asChild
                  isActive={pathname === item.url}
                  onClick={() => router.push(item.url)}
                >
                  <a>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
