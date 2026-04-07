export type TransactionType = 'Receita' | 'Despesa';

export const TRANSACTION_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Contas',
  'Salário',
  'Outros',
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: TransactionCategory;
  date: string;
}
