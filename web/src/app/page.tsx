import { v4 as uuidv4 } from 'uuid';

import { Transaction, columns } from './columns';
import { DataTable } from '../components/data-table';

async function getData(): Promise<Transaction[]> {
  return new Array(50).fill(null).map(() => ({
    idemPotencyId: uuidv4(),
    amount: Math.random() * 1000,
    type: Math.random() < 0.5 ? 'debit' : 'credit',
  }));
}

export default async function Page() {
  const data = await getData();

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
