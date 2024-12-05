import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Employee, EmployeeStatus } from '../../models/employee.model';
import { EmployeeActions } from '../../store/employee.actions';
import { selectSelectedEmployee } from '../../store/employee.selectors';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employee$: Observable<Employee | null>;
  statusOptions = [
    { value: EmployeeStatus.ACTIVE, label: 'Active' },
    { value: EmployeeStatus.INACTIVE, label: 'Inactive' },
    { value: EmployeeStatus.ON_LEAVE, label: 'On Leave' }
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      status: [EmployeeStatus.ACTIVE, Validators.required],
      joiningDate: [new Date(), Validators.required]
    });

    this.employee$ = this.store.select(selectSelectedEmployee).pipe(
      map(employee => employee ?? null)
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = Boolean(id && id !== 'new');

    if (this.isEditMode && id) {
      this.store.dispatch(EmployeeActions.loadEmployee({ id }));

      this.employee$.pipe(
        filter((employee): employee is Employee => employee !== null)
      ).subscribe(employee => {
        this.employeeForm.patchValue({
          ...employee,
          joiningDate: new Date(employee.joiningDate)
        });
      });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData = {
        ...formValue,
        joiningDate: formValue.joiningDate.toISOString().split('T')[0]
      };

      const id = this.route.snapshot.paramMap.get('id');
      if (this.isEditMode && id) {
        this.store.dispatch(EmployeeActions.updateEmployee({
          id,
          employee: employeeData
        }));
      } else {
        this.store.dispatch(EmployeeActions.createEmployee({
          employee: employeeData
        }));
      }

      this.router.navigate(['/employees']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  getErrorMessage(field: string): string {
    const control = this.employeeForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }

    return '';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '_');
  }
}
