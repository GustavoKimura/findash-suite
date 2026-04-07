import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './transaction.model';
import { environment } from '../../environments/environment';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/transactions';

  private transactionsState = signal<Transaction[]>([]);
  private refreshTrigger = signal<void>(undefined);

  private apiTransactions$ = toObservable(this.refreshTrigger).pipe(
    switchMap(() => this.http.get<Transaction[]>(this.apiUrl)),
    tap((transactions) => this.transactionsState.set(transactions)),
  );

  private apiTransactions = toSignal(this.apiTransactions$, {
    initialValue: [],
  });

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
    this.refreshTrigger.set();
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    this.http.post(this.apiUrl, transaction).subscribe(() => this.refresh());
  }

  updateTransaction(updatedTransaction: Transaction): void {
    this.http
      .put(`${this.apiUrl}/${updatedTransaction.id}`, updatedTransaction)
      .subscribe(() => this.refresh());
  }

  deleteTransaction(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.refresh());
  }
}
