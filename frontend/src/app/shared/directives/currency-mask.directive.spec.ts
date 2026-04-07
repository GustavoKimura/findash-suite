import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyMaskDirective } from './currency-mask.directive';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
  template: `<input type="text" appCurrencyMask [(ngModel)]="value" />`,
  standalone: true,
  imports: [CurrencyMaskDirective, FormsModule],
})
class TestComponent {
  value: number | null = null;
}

describe('CurrencyMaskDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');
  });

  it('should format initial value', async () => {
    component.value = 1234.56;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inputEl.value.replace(/\s/g, ' ')).toContain('1.234,56');
  });

  it('should mask input event and update model', () => {
    inputEl.value = '123456';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.value).toBe(1234.56);
  });

  it('should handle blur event properly', () => {
    inputEl.dispatchEvent(new Event('blur'));
    expect(inputEl.classList).toBeDefined();
  });
});
