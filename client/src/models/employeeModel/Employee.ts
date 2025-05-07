/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Employee {
    empid: any;
    profile: any;
    fullname: string;
    designation: string;
    department: string;
    salary: any;
    role:string;
    email?:string;
    password?:string;
    created_at?:any;
    updated_at?:any;
}

export interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (empid: number) => void;
    onDelete: (empid: number) => void;
    onView: (empid: number) => void;
  }
  
  export interface EmployeeModalProps {
    employee: Employee | null;
    onClose: () => void;
}

export interface EmployeeActionsProps {
    empid: number;
    onEdit: (empid: number) => void;
    onDelete: (empid: number) => void;
    onView: (empid: number) => void;
}