export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  status: EmployeeStatus;
  joiningDate: string;
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}
