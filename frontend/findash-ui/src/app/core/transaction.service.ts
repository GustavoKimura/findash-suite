import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './transaction.model';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/transactions';

  private transactionsState = signal<Transaction[]>([]);

  public isFetching = signal(false);
  public isMutating = signal(false);

  public transactions = this.transactionsState.asReadonly();

  public totalIncome = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'Receita')
      .reduce((acc, t) => acc + t.amount, 0),
  );

  public totalExpenses = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'Despesa')
      .reduce((acc, t) => acc + t.amount, 0),
  );

  public balance = computed(() => this.totalIncome() - this.totalExpenses());

  public expensesByCategory = computed(() => {
    const expenses = this.transactions().filter((t) => t.type === 'Despesa');
    const categoryMap = new Map<string, number>();

    for (const expense of expenses) {
      const currentTotal = categoryMap.get(expense.category) ?? 0;
      categoryMap.set(expense.category, currentTotal + expense.amount);
    }
    return Object.fromEntries(categoryMap);
  });

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.isFetching.set(true);
    this.http
      .get<Transaction[]>(this.apiUrl)
      .pipe(finalize(() => this.isFetching.set(false)))
      .subscribe((transactions) => this.transactionsState.set(transactions));
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    this.isMutating.set(true);
    this.http
      .post(this.apiUrl, transaction)
      .pipe(finalize(() => this.isMutating.set(false)))
      .subscribe(() => this.refresh());
  }

  updateTransaction(updatedTransaction: Transaction): void {
    this.isMutating.set(true);
    this.http
      .put(`${this.apiUrl}/${updatedTransaction.id}`, updatedTransaction)
      .pipe(finalize(() => this.isMutating.set(false)))
      .subscribe(() => this.refresh());
  }

  deleteTransaction(id: string): void {
    this.isMutating.set(true);
    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.isMutating.set(false)))
      .subscribe(() => this.refresh());
  }
}
