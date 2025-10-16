'use client';

import { TransactionPanel } from '@/components/flow/transaction-panel';

import '@xyflow/react/dist/style.css';

export default function CreateTransactionPage() {
  return (
    <div className='w-full h-full '>
      <TransactionPanel />
    </div>
  );
}
