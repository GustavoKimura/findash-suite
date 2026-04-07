import { TestBed } from '@angular/core/testing';
import { ApiLoadingComponent } from './api-loading.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ApiLoadingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiLoadingComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ApiLoadingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
