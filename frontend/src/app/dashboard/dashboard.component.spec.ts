import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardViewModel } from './dashboard.viewmodel';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
  let viewModelMock: any;

  beforeEach(async () => {
    viewModelMock = {
      username: signal('testuser'),
      openAddModal: vi.fn(),
      logout: vi.fn(),
      totalIncome: signal(100),
      totalExpenses: signal(50),
      balance: signal(50),
      chartData: signal({ datasets: [{ data: [50] }] }),
      chartOptions: {},
      isLoading: signal(false),
      sortedTransactions: signal([]),
      openEditModal: vi.fn(),
      delete: vi.fn(),
      isModalOpen: signal(false),
      editingTransaction: signal(null),
      closeModal: vi.fn(),
      form: { invalid: false },
      submit: vi.fn(),
      categories: ['Lazer'],
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    })
      .overrideComponent(DashboardComponent, {
        set: {
          providers: [{ provide: DashboardViewModel, useValue: viewModelMock }],
        },
      })
      .compileComponents();
  });

  it('should create the dashboard component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
