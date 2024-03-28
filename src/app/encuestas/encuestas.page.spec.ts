import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestasPage } from './encuestas.page';

describe('EncuestasPage', () => {
  let component: EncuestasPage;
  let fixture: ComponentFixture<EncuestasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EncuestasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function async(arg0: () => void): jasmine.ImplementationCallback {
  throw new Error('Function not implemented.');
}

