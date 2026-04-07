import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from '../core/transaction.service';
import {
  Transaction,
  TransactionCategory,
  TransactionType,
  TRANSACTION_CATEGORIES,
} from '../core/transaction.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Injectable()
export class DashboardViewModel {
  private transactionService = inject(TransactionService);
  private fb = inject(FormBuilder);

  public categories = TRANSACTION_CATEGORIES;

  public form = this.fb.group({
    id: [null as string | null],
    description: ['', Validators.required],
    amount: [
      null as number | null,
      [Validators.required, Validators.min(0.01)],
    ],
    type: ['Despesa' as TransactionType, Validators.required],
    category: [this.categories[0] as TransactionCategory, Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
  });

  public isModalOpen = signal(false);
  public editingTransaction = signal<Transaction | null>(null);

  public totalIncome = this.transactionService.totalIncome;
  public totalExpenses = this.transactionService.totalExpenses;
  public balance = this.transactionService.balance;
  public sortedTransactions = this.transactionService.transactions;
  public isLoading = this.transactionService.isLoading;

  public chartData = computed((): ChartConfiguration<'doughnut'>['data'] => {
    const expenses = this.transactionService.expensesByCategory();
    return {
      labels: Object.keys(expenses),
      datasets: [
        {
          data: Object.values(expenses),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#C9CBCF',
            '#7C4DFF',
          ],
          borderColor: '#1F2937',
          borderWidth: 2,
          hoverBorderColor: '#374151',
        },
      ],
    };
  });

  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#D1D5DB',
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
    },
    cutout: '60%',
  };

  public openAddModal(): void {
    this.form.reset({
      id: null,
      description: '',
      amount: null,
      type: 'Despesa',
      category: this.categories[0],
      date: new Date().toISOString().substring(0, 10),
    });
    this.editingTransaction.set(null);
    this.isModalOpen.set(true);
  }

  public openEditModal(transaction: Transaction): void {
    this.form.patchValue(transaction);
    this.editingTransaction.set(transaction);
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
    this.editingTransaction.set(null);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    const transactionData = {
      description: formValue.description,
      amount: formValue.amount,
      type: formValue.type,
      category: formValue.category,
      date: formValue.date,
    } as Omit<Transaction, 'id'>;

    if (this.editingTransaction()) {
      const updatedTransaction = {
        ...transactionData,
        id: this.editingTransaction()!.id,
      };
      this.transactionService.updateTransaction(updatedTransaction);
    } else {
      this.transactionService.addTransaction(transactionData);
    }

    this.closeModal();
  }

  public delete(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
