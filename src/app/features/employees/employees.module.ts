import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Store
import { employeeReducer } from './store/employee.reducer';
import { EmployeeEffects } from './store/employee.effects';

// Components
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,

    // NgRx
    StoreModule.forFeature('employees', employeeReducer),
    EffectsModule.forFeature([EmployeeEffects])
  ],
  exports: [
    EmployeeListComponent,
    EmployeeDetailsComponent
  ]
})
export class EmployeesModule { }
