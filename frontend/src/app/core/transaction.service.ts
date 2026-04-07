import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './transaction.model';
import { environment } from '../../environments/environment';
import { finalize, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/transactions';

  private transactionsState = signal<Transaction[]>([]);
  public isLoading = signal(false);

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

  private fetchTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(this.apiUrl)
      .pipe(finalize(() => this.isLoading.set(false)));
  }

  refresh(): void {
    this.isLoading.set(true);
    this.fetchTransactions().subscribe({
      next: (transactions) => this.transactionsState.set(transactions),
      error: (err) => console.error('Failed to refresh transactions', err),
    });
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    this.isLoading.set(true);
    this.http
      .post(this.apiUrl, transaction)
      .pipe(switchMap(() => this.fetchTransactions()))
      .subscribe({
        next: (transactions) => this.transactionsState.set(transactions),
        error: (err) => {
          console.error('Add transaction failed', err);
          this.isLoading.set(false);
        },
      });
  }

  updateTransaction(updatedTransaction: Transaction): void {
    this.isLoading.set(true);
    this.http
      .put(`${this.apiUrl}/${updatedTransaction.id}`, updatedTransaction)
      .pipe(switchMap(() => this.fetchTransactions()))
      .subscribe({
        next: (transactions) => this.transactionsState.set(transactions),
        error: (err) => {
          console.error('Update transaction failed', err);
          this.isLoading.set(false);
        },
      });
  }

  deleteTransaction(id: string): void {
    this.isLoading.set(true);
    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(switchMap(() => this.fetchTransactions()))
      .subscribe({
        next: (transactions) => this.transactionsState.set(transactions),
        error: (err) => {
          console.error('Delete transaction failed', err);
          this.isLoading.set(false);
        },
      });
  }
}
