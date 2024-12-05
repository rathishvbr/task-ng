import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './features/employees/components/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './features/employees/components/employee-details/employee-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/new', component: EmployeeDetailsComponent },
  { path: 'employees/:id', component: EmployeeDetailsComponent },
  { path: 'employees/:id/edit', component: EmployeeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
