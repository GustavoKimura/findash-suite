import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render content when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.fixed')).toBeNull();
  });

  it('should render content and title when isOpen is true', () => {
    component.isOpen = true;
    component.title = 'Test Title';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.fixed')).not.toBeNull();
    expect(compiled.querySelector('h3')?.textContent).toContain('Test Title');
  });

  it('should emit modalClose when closeModal is called', () => {
    const emitSpy = vi.spyOn(component.modalClose, 'emit');
    component.closeModal();
    expect(emitSpy).toHaveBeenCalled();
  });
});
