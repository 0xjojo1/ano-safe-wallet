'use client';

import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { ScanEye } from 'lucide-react';

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
            <a href='#'>
              <ScanEye className='!size-5' />
              <span className='text-base font-semibold'>Ano Safe</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
