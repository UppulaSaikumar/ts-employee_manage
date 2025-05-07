import { pool } from "../utils/db";
import { Employee } from "../types/employee.types";
// import { sendKafkaMessage } from "../utils/kafka";

export const getAllEmployees = async (): Promise<Employee[]> => {
  const result = await pool.query("SELECT * FROM employees");
  return result.rows;
};

export const insertEmployee = async (employee: Employee): Promise<void> => {
  const { empid, profile, fullname, designation, department, salary, role } = employee;

  const checkSql = `SELECT COUNT(*) FROM employees WHERE empid = $1`;
  const checkResult = await pool.query(checkSql, [empid]);
  const count = Number(checkResult.rows[0].count);

  if (count > 0) {
    throw new Error(`Employee already exists with empid: ${empid}`);
  }

  const insertSql = `
    INSERT INTO employees (empid, profile, fullname, designation, department, salary, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  await pool.query(insertSql, [empid, profile, fullname, designation, department, salary, role]);

  const message = JSON.stringify({
    action: 'CREATE',
    employee: { empid, profile, fullname, designation, department, salary, role }
  });
  // await sendKafkaMessage('employee-events', message);
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<void> => {
  const { profile, fullname, designation, department, salary } = employee;

  const checkSql = `SELECT * FROM employees WHERE empid = $1`;
  const result = await pool.query(checkSql, [id]);

  if (result.rows.length === 0) {
    throw new Error("Employee not found");
  }

  const updateSql = `
    UPDATE employees
    SET profile = $1, fullname = $2, designation = $3, department = $4, salary = $5
    WHERE empid = $6
  `;
  await pool.query(updateSql, [profile, fullname, designation, department, salary, id]);

  const message = JSON.stringify({
    action: 'UPDATE',
    employeeId: id,
    updatedFields: { profile, fullname, designation, department, salary }
  });
  // await sendKafkaMessage('employee-events', message);
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const deleteSql = `DELETE FROM employees WHERE empid = $1`;
  await pool.query(deleteSql, [id]);

  const message = JSON.stringify({
    action: 'DELETE',
    employeeId: id
  });
  // await sendKafkaMessage('employee-events', message);
};
