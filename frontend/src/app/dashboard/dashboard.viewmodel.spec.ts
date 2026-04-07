import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DashboardViewModel } from './dashboard.viewmodel';
import { TransactionService } from '../core/transaction.service';
import { AuthService } from '../core/auth.service';
import { Transaction } from '../core/transaction.model';
import { signal } from '@angular/core';

describe('DashboardViewModel', () => {
  let viewModel: DashboardViewModel;
  let transactionService: TransactionService;
  let authService: AuthService;

  const mockTransactionService = {
    addTransaction: vi.fn(),
    updateTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    totalIncome: signal(1000),
    totalExpenses: signal(500),
    balance: signal(500),
    transactions: signal([]),
    isLoading: signal(false),
    expensesByCategory: signal({ Lazer: 100 }),
  };

  const mockAuthService = {
    logout: vi.fn(),
    getUsername: vi.fn().mockReturnValue('testuser'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        DashboardViewModel,
        FormBuilder,
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    viewModel = TestBed.inject(DashboardViewModel);
    transactionService = TestBed.inject(TransactionService);
    authService = TestBed.inject(AuthService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(viewModel).toBeTruthy();
  });

  it('should open the add modal with a reset form', () => {
    viewModel.openAddModal();
    expect(viewModel.isModalOpen()).toBe(true);
    expect(viewModel.editingTransaction()).toBeNull();
    expect(viewModel.form.get('description')?.value).toBe('');
  });

  it('should open the edit modal and patch the form', () => {
    const transaction: Transaction = {
      id: '1',
      description: 'Test',
      amount: 100,
      type: 'Despesa',
      category: 'Lazer',
      date: '2023-01-01',
    };
    viewModel.openEditModal(transaction);
    expect(viewModel.isModalOpen()).toBe(true);
    expect(viewModel.editingTransaction()).toEqual(transaction);
    expect(viewModel.form.get('description')?.value).toBe('Test');
  });

  it('should close the modal', () => {
    viewModel.openAddModal();
    viewModel.closeModal();
    expect(viewModel.isModalOpen()).toBe(false);
    expect(viewModel.editingTransaction()).toBeNull();
  });

  it('should call addTransaction when submitting a new transaction', () => {
    viewModel.openAddModal();
    viewModel.form.patchValue({
      description: 'New Item',
      amount: 50,
      type: 'Despesa',
      category: 'Outros',
      date: '2023-01-01',
    });
    viewModel.submit();
    expect(transactionService.addTransaction).toHaveBeenCalled();
    expect(viewModel.isModalOpen()).toBe(false);
  });

  it('should call updateTransaction when submitting an existing transaction', () => {
    const transaction: Transaction = {
      id: '1',
      description: 'Test',
      amount: 100,
      type: 'Despesa',
      category: 'Lazer',
      date: '2023-01-01',
    };
    viewModel.openEditModal(transaction);
    viewModel.form.patchValue({ description: 'Updated Item' });
    viewModel.submit();
    expect(transactionService.updateTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', description: 'Updated Item' }),
    );
    expect(viewModel.isModalOpen()).toBe(false);
  });

  it('should call deleteTransaction', () => {
    viewModel.delete('1');
    expect(transactionService.deleteTransaction).toHaveBeenCalledWith('1');
  });

  it('should call authService.logout', () => {
    viewModel.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
