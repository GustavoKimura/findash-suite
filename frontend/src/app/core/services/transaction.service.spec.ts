import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TransactionService } from './transaction.service';
import { environment } from '../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/transactions';

  const dummyTransactions: any[] = [
    {
      id: '1',
      type: 'Receita',
      description: 'Salário',
      amount: 5000,
      category: 'Salário',
      date: '2023-10-01',
    },
    {
      id: '2',
      type: 'Despesa',
      description: 'Aluguel',
      amount: 1500,
      category: 'Moradia',
      date: '2023-10-05',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne(apiUrl);
    req.flush(dummyTransactions);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should calculate total income', () => {
    expect(service.totalIncome()).toBe(5000);
  });

  it('should calculate total expenses', () => {
    expect(service.totalExpenses()).toBe(1500);
  });

  it('should calculate balance', () => {
    expect(service.balance()).toBe(3500);
  });

  it('should group expenses by category', () => {
    expect(service.expensesByCategory()).toEqual({ Moradia: 1500 });
  });

  it('should add transaction and refresh state', () => {
    const newTx = {
      type: 'Despesa',
      description: 'Luz',
      amount: 100,
      category: 'Contas',
      date: '2023-10-10',
    };
    service.addTransaction(newTx as any);

    const reqPost = httpMock.expectOne(apiUrl);
    expect(reqPost.request.method).toBe('POST');
    reqPost.flush({});

    const reqGet = httpMock.expectOne(apiUrl);
    reqGet.flush([...dummyTransactions, { ...newTx, id: '3' }]);

    expect(service.transactions().length).toBe(3);
  });

  it('should update transaction and refresh state', () => {
    const updatedTx = { ...dummyTransactions[0], amount: 6000 };
    service.updateTransaction(updatedTx);

    const reqPut = httpMock.expectOne(`${apiUrl}/1`);
    expect(reqPut.request.method).toBe('PUT');
    reqPut.flush({});

    const reqGet = httpMock.expectOne(apiUrl);
    reqGet.flush([updatedTx, dummyTransactions[1]]);

    expect(service.transactions()[0].amount).toBe(6000);
  });

  it('should delete transaction and refresh state', () => {
    service.deleteTransaction('1');

    const reqDelete = httpMock.expectOne(`${apiUrl}/1`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});

    const reqGet = httpMock.expectOne(apiUrl);
    reqGet.flush([dummyTransactions[1]]);

    expect(service.transactions().length).toBe(1);
  });
});
