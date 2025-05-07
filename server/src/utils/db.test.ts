import { describe, it, expect } from 'vitest';
import { pool } from './db'; 

describe('PostgreSQL Pool', () => {
  it('should connect and run a basic SELECT 1 query', async () => {
    const res = await pool.query('SELECT 1 as res');
    expect(res.rows[0].res).toBe(1);
  });

  it('should return proper data types (no date parsing)', async () => {
    const res = await pool.query(`SELECT DATE '2025-04-19' as my_date`);
    expect(res.rows[0].my_date).toBe('2025-04-19'); 
  });

  it('should handle bad query with error', async () => {
    try {
      await pool.query('SELECT * FROM non_existent_table');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/relation .* does not exist/);
    }
  });
});
