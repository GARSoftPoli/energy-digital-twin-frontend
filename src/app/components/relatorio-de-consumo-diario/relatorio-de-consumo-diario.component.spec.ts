import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RelatorioDeConsumoDiarioComponent } from './relatorio-de-consumo-diario.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../loader/loader.component';
import { NoDataComponent } from '../no-data/no-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataService } from 'src/app/services/data.service';
import { Observable, of } from 'rxjs';
import { Viewport } from 'karma-viewport/dist/adapter/viewport';
declare const viewport: Viewport;

describe('RelatorioDeConsumoDiarioComponent', () => {
  let service: DataService;
  let component: RelatorioDeConsumoDiarioComponent;
  let fixture: ComponentFixture<RelatorioDeConsumoDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatFormFieldModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
      ],
      declarations: [
        RelatorioDeConsumoDiarioComponent,
        LoaderComponent,
        NoDataComponent
      ],
      providers: [
        DataService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioDeConsumoDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(DataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateSizes when window is resized', () => {
    // Spy to check if it's called
    spyOn(component, 'updateSizes');
    // Dispatch resize event
    window.dispatchEvent(new Event('resize'));
    // Check if updateSizes was called
    expect(component.updateSizes).toHaveBeenCalled();
  });

  it('should update sizes for responsiveness when titleContainer width > 600px', () => {
    const titleWrapper = document.getElementById('dailyConsumptionTitleWrapper');
    const datePicker = document.getElementById('dailyConsumptionDatePicker');
    // Set the viewport size
    viewport.set('desktop');
    // Call the updateSizes method
    component.updateSizes();
    // Expectations
    if (datePicker && titleWrapper) {
      expect(datePicker.classList.contains('wide')).toBeFalsy();
      expect(titleWrapper.classList.contains('wide')).toBeFalsy();
    }
    else {
      fail('datePicker and titleWrapper are not defined');
    }
  });

  it('should update sizes for responsiveness when titleContainer width <= 600px', () => {
    const titleWrapper = document.getElementById('dailyConsumptionTitleWrapper');
    const datePicker = document.getElementById('dailyConsumptionDatePicker');
    // Set the viewport size
    viewport.set('mobile');
    // Call the updateSizes method
    component.updateSizes();
    // Advance the virtual clock to allow asynchronous operations to complete
    // Expectations
    if (datePicker && titleWrapper) {
      expect(datePicker.classList.contains('wide')).toBeTruthy();
      expect(titleWrapper.classList.contains('wide')).toBeTruthy();
    }
    else {
      fail('datePicker and titleWrapper are not defined');
    }
  });

  it('should call getData with the formatted date when onDateSelect is called', () => {
    // Mock the necessary dependencies or services (e.g., this.date.getRawValue(), this.getData())
    spyOn(component.date, 'getRawValue').and.returnValue(new Date('2023-9-14')); // Mock the date value
    spyOn(component, 'getData');
    // Call the onDateSelect function
    component.onDateSelect();
    // Expect that the getData method was called with the formatted date string '2023-09-14'
    expect(component.getData).toHaveBeenCalledWith('2023-09-14');
  });

  it('should load data', fakeAsync(() => {
    // Mock the necessary dependencies
    const responseData = {
      'consumo-acumulado': '<div>Consumo Acumulado Chart</div>',
      'curva-de-carga': '<div>Curva de Carga Chart</div>',
      'demanda-maxima': 0,
      'demanda-media': 0,
      'variacao-demanda-maxima': 0,
      'variacao-demanda-media': 0,
      'horario-de-pico': '',
      'horario-de-pico-ontem': '',
      'consumo-total': 0,
      'variacao-consumo-total': 0,
      'consumo-total-a': 0,
      'variacao-consumo-total-a': 0,
      'consumo-total-b': 0,
      'variacao-consumo-total-b': 0,
      'consumo-total-c': 0,
      'variacao-consumo-total-c': 0
    };
    const dateString = '2023-09-14';
    // Spy to check if it's called
    spyOn(service, 'getDailyConsumptionData').and.returnValue(of(responseData));
    // Call getData
    component.getData(dateString);
    // Advance the fakeAsync scheduler
    tick(); 
    // Expectations
    expect(service.getDailyConsumptionData).toHaveBeenCalledWith(dateString);
    expect(component.data).toEqual(responseData);
    expect(component.loading).toBe(false);
  }));

  it('should not load data', fakeAsync(() => {
    // Mock the necessary dependencies
    const dateString = '2023-09-14';
    // Spy to check if it's called
    spyOn(service, 'getDailyConsumptionData').and.returnValue(
      new Observable((observer) => {
        observer.error(new Error('Some error occurred'));
      })
    );
    // Call getData
    component.getData(dateString);
    // Advance the fakeAsync scheduler
    tick(1); 
    // Expectations
    expect(service.getDailyConsumptionData).toHaveBeenCalledWith(dateString);
    expect(component.data).toEqual(null); // Data should not be set
    expect(component.loading).toBe(false); // Loading should be false
  }));
});
