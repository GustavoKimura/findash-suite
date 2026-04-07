import { TestBed } from '@angular/core/testing';
import { DashboardViewModel } from './dashboard.viewmodel';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DashboardViewModel', () => {
  let vm: DashboardViewModel;
  let transactionServiceMock: any;
  let authServiceMock: any;

  beforeEach(() => {
    transactionServiceMock = {
      totalIncome: signal(1000),
      totalExpenses: signal(500),
      balance: signal(500),
      transactions: signal([]),
      isLoading: signal(false),
      expensesByCategory: signal({ Moradia: 500 }),
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    };

    authServiceMock = {
      getUsername: vi.fn().mockReturnValue('TestUser'),
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardViewModel,
        FormBuilder,
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });
    vm = TestBed.inject(DashboardViewModel);
  });

  it('should initialize correctly', () => {
    expect(vm.username()).toBe('TestUser');
    expect(vm.totalIncome()).toBe(1000);
  });

  it('should open and close add modal', () => {
    vm.openAddModal();
    expect(vm.isModalOpen()).toBe(true);
    expect(vm.editingTransaction()).toBeNull();

    vm.closeModal();
    expect(vm.isModalOpen()).toBe(false);
  });

  it('should open edit modal', () => {
    const tx: any = { id: '1', description: 'Test' };
    vm.openEditModal(tx);
    expect(vm.isModalOpen()).toBe(true);
    expect(vm.editingTransaction()).toEqual(tx);
  });

  it('should not submit if form is invalid', () => {
    vm.openAddModal();
    vm.form.patchValue({ description: '' });
    vm.submit();
    expect(transactionServiceMock.addTransaction).not.toHaveBeenCalled();
  });

  it('should submit add transaction', () => {
    vm.openAddModal();
    vm.form.patchValue({
      description: 'New',
      amount: 100,
      type: 'Despesa',
      category: 'Lazer',
      date: '2023-01-01',
    });
    vm.submit();
    expect(transactionServiceMock.addTransaction).toHaveBeenCalled();
    expect(vm.isModalOpen()).toBe(false);
  });

  it('should submit edit transaction', () => {
    const tx: any = { id: '1', description: 'Test' };
    vm.openEditModal(tx);
    vm.form.patchValue({
      description: 'Updated',
      amount: 100,
      type: 'Despesa',
      category: 'Lazer',
      date: '2023-01-01',
    });
    vm.submit();
    expect(transactionServiceMock.updateTransaction).toHaveBeenCalled();
    expect(vm.isModalOpen()).toBe(false);
  });

  it('should delete transaction', () => {
    vm.delete('1');
    expect(transactionServiceMock.deleteTransaction).toHaveBeenCalledWith('1');
  });

  it('should logout', () => {
    vm.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should generate chart data correctly', () => {
    const data = vm.chartData();
    expect(data.labels).toEqual(['Moradia']);
    expect(data.datasets[0].data).toEqual([500]);
  });
});
