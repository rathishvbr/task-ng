import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeStatus } from '../models/employee.model';
import { environment } from 'src/environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const mockEmployee: Employee = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Developer',
    status: EmployeeStatus.ACTIVE,
    joiningDate: '2023-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all employees', () => {
      const employees = [mockEmployee];

      service.getAll().subscribe((response: Employee[]) => {
        expect(response).toEqual(employees);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
      expect(req.request.method).toBe('GET');
      req.flush(employees);
    });

    it('should handle error', () => {
      service.getAll().subscribe({
        error: (error: { status: number }) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getById', () => {
    it('should return a single employee', () => {
      service.getById('1').subscribe((response: Employee) => {
        expect(response).toEqual(mockEmployee);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEmployee);
    });

    it('should handle error', () => {
      service.getById('999').subscribe({
        error: (error: { status: number }) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    const { id, ...newEmployee } = mockEmployee;

    it('should create an employee', () => {
      service.create(newEmployee).subscribe((response: Employee) => {
        expect(response).toEqual(mockEmployee);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEmployee);
      req.flush(mockEmployee);
    });

    it('should handle error', () => {
      const invalidEmployee = { ...newEmployee, email: 'invalid-email' };

      service.create(invalidEmployee).subscribe({
        error: (error: { status: number }) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    const updatedEmployee = { ...mockEmployee, name: 'Updated Name' };

    it('should update an employee', () => {
      service.update(mockEmployee.id, { name: 'Updated Name' }).subscribe((response: Employee) => {
        expect(response).toEqual(updatedEmployee);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/${mockEmployee.id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: 'Updated Name' });
      req.flush(updatedEmployee);
    });

    it('should handle error', () => {
      const invalidEmployee = { email: 'invalid-email' };

      service.update(mockEmployee.id, invalidEmployee).subscribe({
        error: (error: { status: number }) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/${mockEmployee.id}`);
      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('delete', () => {
    it('should delete an employee', () => {
      let completed = false;
      service.delete('1').subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        complete: () => {
          completed = true;
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
      expect(completed).toBe(true);
    });

    it('should handle error', () => {
      service.delete('999').subscribe({
        error: (error: { status: number }) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
