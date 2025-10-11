'use client';

import { AppSidebarHeader } from './AppSiderbarHeader';
import { AppSidebarFooter } from './AppSiderbarFooter';
import { AppSidebarContent } from './AppSiderbarContent';
import { Sidebar } from '@workspace/ui/components/sidebar';
import { useConnectWallet } from '@web3-onboard/react';

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
