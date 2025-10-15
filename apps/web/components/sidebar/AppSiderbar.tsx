'use client';

import { useConnectWallet } from '@web3-onboard/react';

import { Sidebar } from '@workspace/ui/components/sidebar';

import { AppSidebarContent } from './AppSiderbarContent';
import { AppSidebarFooter } from './AppSiderbarFooter';
import { AppSidebarHeader } from './AppSiderbarHeader';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [{ wallet }] = useConnectWallet();

  return (
    <Sidebar collapsible='icon' {...props}>
      <AppSidebarHeader />
      <AppSidebarContent showAccountsSelect={!!wallet} />
      <AppSidebarFooter />
    </Sidebar>
  );
}
