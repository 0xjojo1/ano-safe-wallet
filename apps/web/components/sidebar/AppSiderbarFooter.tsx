'use client';

import { SidebarFooter, SidebarMenu, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';

import ConnectWallet from '@/components/connect-wallet';

export function AppSidebarFooter() {
  const { state } = useSidebar();

  const isCollapsed = state === 'collapsed';
  const size = isCollapsed ? 'minimal' : 'default';

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <ConnectWallet size={size} />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
