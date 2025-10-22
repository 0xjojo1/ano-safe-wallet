'use client';

import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive';

export default function Page() {
  return (
    <div className='flex flex-col gap-6'>
      <ChartAreaInteractive />
      <ChartAreaInteractive />
      <ChartAreaInteractive />
      <ChartAreaInteractive />
      <ChartAreaInteractive />
    </div>
  );
}
