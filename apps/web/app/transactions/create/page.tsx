'use client';

import '@xyflow/react/dist/style.css';

import { TransactionPanel } from '@/components/flow/transaction-panel';

export default function CreateTransactionPage() {
  return (
    <div className='w-full h-full'>
      <TransactionPanel />
    </div>
  );
}
