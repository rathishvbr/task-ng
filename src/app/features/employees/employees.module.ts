import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Store
import { employeeReducer } from './store/employee.reducer';
import { EmployeeEffects } from './store/employee.effects';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,

    // NgRx
    StoreModule.forFeature('employees', employeeReducer),
    EffectsModule.forFeature([EmployeeEffects])
  ],
  exports: []
})
export class EmployeesModule { }
