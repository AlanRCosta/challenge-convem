export interface Transaction {
  idempotencyId: string;
  amount: number;
  type: string;
}
