import {Component, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-relatorio-de-consumo-mensal',
  templateUrl: './relatorio-de-consumo-mensal.component.html',
  styleUrls: ['./relatorio-de-consumo-mensal.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  encapsulation: ViewEncapsulation.None,
})

export class RelatorioDeConsumoMensalComponent {
  date = new FormControl(moment());

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  constructor(){
    var month = this.date.getRawValue()!.toDate().getMonth();
    month += 1;
    var year = this.date.getRawValue()!.toDate().getFullYear();
    if(month <= 9){
      var dateString = year + "-" + "0" + month;
    }
    else{
      var dateString = year + "-" + month;
    }
    console.log(dateString);
  }

  onDateChange(event: any): void {
    var month = event.toDate().getMonth();
    month += 1;
    var year = event.toDate().getFullYear();
    if(month <= 9){
      var dateString = year + "-" + "0" + month;
    }
    else{
      var dateString = year + "-" + month;
    }
    console.log(dateString);
  }
}