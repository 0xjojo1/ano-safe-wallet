'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Web3OnboardProvider } from '@web3-onboard/react';
import { web3Onboard } from '@/lib/onboard-config';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@workspace/ui/components/sidebar';
import { AppSidebar } from './sidebar/AppSiderbar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header>
              <div className='flex items-center p-4 border-b h-12 flex-shrink-0'>
                <SidebarTrigger />
              </div>
            </header>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </Web3OnboardProvider>
    </NextThemesProvider>
  );
}
