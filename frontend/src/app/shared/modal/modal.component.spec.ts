import { TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('ModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should emit modalClose event when closeModal is called', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.modalClose, 'emit');

    component.closeModal();
    expect(emitSpy).toHaveBeenCalled();
  });
});
