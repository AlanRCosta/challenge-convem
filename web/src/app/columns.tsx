'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Transaction = {
  idemPotencyId: string;
  amount: number;
  type: 'credit' | 'debit';
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'idemPotencyId',
    header: 'ID',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const typeValue: string = row.getValue('type');

      return (
        <div
          className={`${
            typeValue === 'credit' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {typeValue}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      const formattedAmount = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);

      return <div className="text-right font-medium">{formattedAmount}</div>;
    },
  },
];
