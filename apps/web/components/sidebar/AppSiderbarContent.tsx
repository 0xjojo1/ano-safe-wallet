'use client';

import { usePathname, useRouter } from 'next/navigation';

import {
  ArrowLeftRight,
  ArrowUpDown,
  BookUser,
  Coins,
  Gauge,
  HelpCircle,
  ListTodoIcon,
  Plus,
  Search,
  Settings,
  Wallet,
} from 'lucide-react';

import { SafeAccountInfo } from '@workspace/types/safe/account';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';

import { NavSafeSelect } from './nav/nav-safe-select';

const baseItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Gauge,
  },
  {
    title: 'Accounts',
    url: '/accounts',
    icon: Wallet,
  },
  {
    title: 'Assets',
    url: '/assets',
    icon: Coins,
  },
  {
    title: 'Address Book',
    url: '/address-book',
    icon: BookUser,
  },
];

const transactionItems = [
  {
    title: 'Create',
    url: '/transactions/create',
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
    icon: ArrowUpDown,
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

const mockSafeAccounts: SafeAccountInfo[] = [
  {
    chainId: 1,
    address: '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
    nonce: '1',
    threshold: 1,
    owners: ['0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128'],
    singleton: '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
    modules: ['0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128'],
    fallbackHandler: '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
    guard: '0x0d5380f2b3b1d6ed63cef0b04b149e7fc9040128',
    version: '1.4.1+L2',
  },
];

export function AppSidebarContent({ showAccountsSelect = false }: { showAccountsSelect?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();

  const isCollapsed = state === 'collapsed';

  return (
    <SidebarContent className='flex flex-col justify-between'>
      <div>
        {showAccountsSelect && !isCollapsed && (
          <SidebarGroup>
            <NavSafeSelect
              safeAccounts={mockSafeAccounts}
              currentAccount={mockSafeAccounts[0]?.address || ''}
              onSelectAccount={() => {}}
            />
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent className='cursor-pointer'>
            <SidebarMenu>
              {baseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={isCollapsed ? item.title : undefined}
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
                    tooltip={isCollapsed ? item.title : undefined}
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
