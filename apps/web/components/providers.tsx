'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import MyWeb3OnboardProvider from '@/lib/web3-onboard';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@workspace/ui/components/sidebar';
import { AppSidebar } from '@/components/sidebar/AppSiderbar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <MyWeb3OnboardProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header>
              <div className='flex items-center p-4 border-b h-12 flex-shrink-0'>
                <SidebarTrigger />
              </div>
            </header>
            <main className='p-2'>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </MyWeb3OnboardProvider>
    </NextThemesProvider>
  );
}
