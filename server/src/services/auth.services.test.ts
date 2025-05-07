import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as employeeService from './auth.services';
import { pool } from '../utils/db';
import jwt from 'jsonwebtoken';

vi.mock('../utils/db', () => ({
  pool: {
    query: vi.fn()
  }
}));

vi.mock('jsonwebtoken');

const mockedQuery = pool.query as unknown as Mock;
const mockedJwt = jwt as unknown as {
  sign: Mock;
  verify: Mock;
};

const SECRET_KEY = 'testsecret';
process.env.SECRET_KEY = SECRET_KEY;

describe('employeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerEmployee', () => {
    it('should insert employee and return success message', async () => {
      mockedQuery.mockResolvedValueOnce({});

      const result = await employeeService.registerEmployee(
        1,
        'Nagendra',
        'nagendra@gmail.com',
        'nagendra@123'
      );

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO admemps'),
        [1, 'Nagendra', 'nagendra@gmail.com', 'nagendra@123']
      );
      expect(result).toEqual({ message: 'Registered successfully' });
    });

    it('should throw error if DB fails', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB error'));

      await expect(
        employeeService.registerEmployee(2, 'name', 'mail@gmail.com', 'name@123')
      ).rejects.toThrow('DB error');
    });
  });

  describe('loginEmployee', () => {
    it('should return token and employee info if login is successful', async () => {
      mockedQuery
        .mockResolvedValueOnce({ rows: [{ empid: 10, fullname: 'Sai kumar' }] })
        .mockResolvedValueOnce({ rows: [{ role: 'admin' }] });

      mockedJwt.sign = vi.fn().mockReturnValue('fake_token');

      const result = await employeeService.loginEmployee('sai@gmail.com', 'sai@123');

      expect(mockedQuery).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        token: 'fake_token',
        fullname: 'Sai kumar',
        empid: 10,
        role: 'admin'
      });
    });

    it('should return error if credentials are invalid', async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [] });

      const result = await employeeService.loginEmployee('wrong@gmail.com', 'badpass');

      expect(result).toEqual({ error: 'Invalid Email or password' });
    });

    it('should return error if role not found', async () => {
      mockedQuery
        .mockResolvedValueOnce({ rows: [{ empid: 5, fullname: 'Bob' }] }) // Login
        .mockResolvedValueOnce({ rows: [] });

      const result = await employeeService.loginEmployee('kiran@gmail.com', 'kiran@123');

      expect(result).toEqual({ error: 'Employee not found in employees table' });
    });

    it('should throw error on DB failure', async () => {
      mockedQuery.mockRejectedValueOnce(new Error('DB Failure'));

      await expect(
        employeeService.loginEmployee('crash@example.com', 'boom')
      ).rejects.toThrow('Error during login');
    });
  });

  describe('verifyToken', () => {
    it('should return decoded payload on valid token', () => {
      const payload = { empid: 42, email: 'sai@kumar.com' };
      mockedJwt.verify = vi.fn().mockReturnValue(payload);

      const result = employeeService.verifyToken('valid.token');

      expect(mockedJwt.verify).toHaveBeenCalledWith('valid.token', SECRET_KEY);
      expect(result).toEqual(payload);
    });

    it('should return null on invalid token', () => {
      mockedJwt.verify = vi.fn(() => {
        throw new Error('Invalid token');
      });

      const result = employeeService.verifyToken('bad.token');

      expect(result).toBeNull();
    });
  });
});
