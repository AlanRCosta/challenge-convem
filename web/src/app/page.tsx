import { Transaction, columns } from './columns';
import { DataTable } from '../components/data-table';

async function getData(): Promise<Transaction[]> {
  const res = await fetch(
    'https://3j2a15f3bb.execute-api.us-east-2.amazonaws.com/Prod',
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const response = await res.json();
  return response;
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
