import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HealthCheckService } from './core/health-check.service';
import { signal } from '@angular/core';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AppComponent', () => {
  beforeEach(async () => {
    const mockHealthCheckService = {
      isApiReady: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
      ],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
