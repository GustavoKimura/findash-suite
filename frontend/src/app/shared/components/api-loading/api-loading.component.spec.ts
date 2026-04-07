import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiLoadingComponent } from './api-loading.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ApiLoadingComponent', () => {
  let component: ApiLoadingComponent;
  let fixture: ComponentFixture<ApiLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'Iniciando a aplicação, por favor aguarde...',
    );
  });
});
