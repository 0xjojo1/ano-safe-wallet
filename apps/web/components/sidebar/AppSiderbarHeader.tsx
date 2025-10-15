'use client';

import { ScanEye } from 'lucide-react';

import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
            <a href='/'>
              <ScanEye className='!size-6' />
              <span className='text-lg font-semibold'>Ano Safe</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
