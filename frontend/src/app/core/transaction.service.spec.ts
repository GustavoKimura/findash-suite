import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { environment } from '../../environments/environment';
import { Transaction } from './transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { runInInjectionContext } from '@angular/core';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Receita',
    description: 'Salary',
    amount: 5000,
    category: 'Salário',
    date: '2023-01-01',
  },
  {
    id: '2',
    type: 'Despesa',
    description: 'Groceries',
    amount: 300,
    category: 'Alimentação',
    date: '2023-01-02',
  },
  {
    id: '3',
    type: 'Despesa',
    description: 'Rent',
    amount: 1500,
    category: 'Moradia',
    date: '2023-01-03',
  },
];

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/transactions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TransactionService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TransactionService);
    const req = httpMock.expectOne(apiUrl);
    req.flush(mockTransactions);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and fetch initial transactions', () => {
    expect(service).toBeTruthy();
    expect(service.transactions()).toEqual(mockTransactions);
  });

  it('should calculate total income', () => {
    expect(service.totalIncome()).toBe(5000);
  });

  it('should calculate total expenses', () => {
    expect(service.totalExpenses()).toBe(1800);
  });

  it('should calculate balance', () => {
    expect(service.balance()).toBe(3200);
  });

  it('should group expenses by category', () => {
    const expenses = service.expensesByCategory();
    expect(expenses['Alimentação']).toBe(300);
    expect(expenses['Moradia']).toBe(1500);
  });

  it('addTransaction should POST and refresh data', () => {
    const newTransaction: Omit<Transaction, 'id'> = {
      type: 'Despesa',
      description: 'New Expense',
      amount: 50,
      category: 'Lazer',
      date: '2023-01-04',
    };
    const updatedTransactions = [
      ...mockTransactions,
      { ...newTransaction, id: '4' },
    ];

    service.addTransaction(newTransaction);

    const postReq = httpMock.expectOne(apiUrl);
    expect(postReq.request.method).toBe('POST');
    postReq.flush({});

    const getReq = httpMock.expectOne(apiUrl);
    getReq.flush(updatedTransactions);

    expect(service.transactions().length).toBe(4);
    expect(service.totalExpenses()).toBe(1850);
  });

  it('updateTransaction should PUT and refresh data', () => {
    const updatedTransaction: Transaction = {
      ...mockTransactions[1],
      amount: 350,
    };

    service.updateTransaction(updatedTransaction);

    const putReq = httpMock.expectOne(`${apiUrl}/${updatedTransaction.id}`);
    expect(putReq.request.method).toBe('PUT');
    putReq.flush({});

    const getReq = httpMock.expectOne(apiUrl);
    getReq.flush(
      mockTransactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t,
      ),
    );

    expect(service.totalExpenses()).toBe(1850);
  });

  it('deleteTransaction should DELETE and refresh data', () => {
    const transactionIdToDelete = '2';

    service.deleteTransaction(transactionIdToDelete);

    const deleteReq = httpMock.expectOne(`${apiUrl}/${transactionIdToDelete}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});

    const getReq = httpMock.expectOne(apiUrl);
    getReq.flush(
      mockTransactions.filter((t) => t.id !== transactionIdToDelete),
    );

    expect(service.transactions().length).toBe(2);
    expect(service.totalExpenses()).toBe(1500);
  });
});
