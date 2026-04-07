import { CurrencyMaskDirective } from './currency-mask.directive';
import { ElementRef } from '@angular/core';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CurrencyMaskDirective', () => {
  let directive: CurrencyMaskDirective;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement('input');
    const elRef = new ElementRef(inputElement);
    directive = new CurrencyMaskDirective(elRef);
  });

  it('should format value to BRL currency on writeValue', () => {
    directive.writeValue(1500.5);
    expect(inputElement.value).toContain('1.500,50');
  });

  it('should format null to empty string on writeValue', () => {
    directive.writeValue(null);
    expect(inputElement.value).toBe('');
  });

  it('should handle setDisabledState', () => {
    directive.setDisabledState!(true);
    expect(inputElement.disabled).toBe(true);
  });

  it('should process onInput correctly', () => {
    let emittedValue: number | null = null;
    directive.registerOnChange((val) => (emittedValue = val));

    inputElement.value = '150050';
    directive.onInput({ target: inputElement } as any);

    expect(emittedValue).toBe(1500.5);
    expect(inputElement.value).toContain('1.500,50');
  });

  it('should process onBlur correctly', () => {
    let touched = false;
    directive.registerOnTouched(() => (touched = true));

    directive.onBlur();
    expect(touched).toBe(true);
  });
});
