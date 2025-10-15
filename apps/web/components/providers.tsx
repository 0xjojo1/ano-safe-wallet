'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@workspace/ui/components/sidebar';

import { AppSidebar } from '@/components/sidebar/AppSiderbar';
import MyWeb3OnboardProvider from '@/lib/web3-onboard';

import { AppBreadcrumb } from './app-bread-crumb';
import { ChainSelect } from './chain-select';

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
              <div className='flex items-center justify-between p-4 border-b h-12 flex-shrink-0 gap-2'>
                <div className='flex items-center gap-2'>
                  <SidebarTrigger />
                  <AppBreadcrumb />
                </div>
                <ChainSelect />
              </div>
            </header>
            <main className='p-6'>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </MyWeb3OnboardProvider>
    </NextThemesProvider>
  );
}
