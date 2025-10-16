'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb';
import { Separator } from '@workspace/ui/components/separator';

const routeConfig: Record<string, { label: string; clickable?: boolean }> = {
  '/': { label: 'Home' },
  '/assets': { label: 'Assets' },
  '/accounts': { label: 'Accounts' },
  '/accounts/create': { label: 'Create Account' },
  '/accounts/[account]': { label: 'Details' },
  '/address-book': { label: 'Address Book' },
  '/transactions': { label: 'Transactions', clickable: false },
  '/transactions/create': { label: 'Create' },
  '/transactions/queue': { label: 'Queue' },
  '/transactions/history': { label: 'History' },
  '/settings': { label: 'Settings' },
};

function getPathSegments(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  const paths = ['/'];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    paths.push(currentPath);
  }

  return paths;
}

export function AppBreadcrumb() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const segments = getPathSegments(pathname);

  // Build breadcrumb entries
  const items = segments.map((path, index) => {
    const isLast = index === segments.length - 1;

    // Static config match
    if (routeConfig[path]) {
      return {
        key: path,
        label: routeConfig[path].label,
        href: path,
        isLast,
        clickable: !isLast && routeConfig[path].clickable !== false,
      };
    }

    // Fallback: show the path segment
    const parts = path.split('/').filter(Boolean);
    const fallbackLabel = parts[parts.length - 1] || path;
    return {
      key: path,
      label: fallbackLabel,
      href: path,
      isLast,
      clickable: !isLast,
    };
  });

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item) => (
            <React.Fragment key={item.key}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : item.clickable ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className='cursor-default text-muted-foreground'>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
