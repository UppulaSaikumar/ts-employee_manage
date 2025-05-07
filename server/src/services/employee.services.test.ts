import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as employeeService from './employee.services';
import { pool } from '../utils/db';
import { Employee } from '../types/employee.types';

vi.mock('../utils/db', () => ({
  pool: {
    query: vi.fn()
  }
}));

const mockEmployee: Employee = {
  empid: 1,
  profile: 'profile.jpg',
  fullname: 'Sai kumar ',
  designation: 'Software Engineer',
  department: 'Engineering',
  salary: 75000,
  role: 'developer'
};

describe('Employee Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllEmployees returns employee list', async () => {
    (pool.query as any).mockResolvedValue({ rows: [mockEmployee] });

    const result = await employeeService.getAllEmployees();
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM employees');
    expect(result).toEqual([mockEmployee]);
  });

  it('insertEmployee throws error if employee exists', async () => {
    (pool.query as any).mockResolvedValueOnce({ rows: [{ count: '1' }] });

    await expect(employeeService.insertEmployee(mockEmployee)).rejects.toThrow(
      `Employee already exists with empid: ${mockEmployee.empid}`
    );
  });

  it('insertEmployee inserts a new employee', async () => {
    (pool.query as any)
      .mockResolvedValueOnce({ rows: [{ count: '0' }] })
      .mockResolvedValueOnce({});

    await employeeService.insertEmployee(mockEmployee);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO employees'), [
      mockEmployee.empid,
      mockEmployee.profile,
      mockEmployee.fullname,
      mockEmployee.designation,
      mockEmployee.department,
      mockEmployee.salary,
      mockEmployee.role
    ]);
  });

  it('updateEmployee throws error if employee not found', async () => {
    (pool.query as any).mockResolvedValueOnce({ rows: [] });

    await expect(employeeService.updateEmployee('E001', { salary: 80000 })).rejects.toThrow('Employee not found');
  });

  it('updateEmployee updates an existing employee', async () => {
    (pool.query as any)
      .mockResolvedValueOnce({ rows: [mockEmployee] })
      .mockResolvedValueOnce({});

    await employeeService.updateEmployee('1', {
      salary: 80000,
      fullname: 'NAgendra',
      profile: 'new-profile.jpg',
      designation: 'Senior Engineer',
      department: 'Tech'
    });

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE employees'), expect.any(Array));
  });

  it('deleteEmployee deletes the employee', async () => {
    (pool.query as any).mockResolvedValueOnce({});

    await employeeService.deleteEmployee('1');

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM employees'), ['1']);
  });
});
