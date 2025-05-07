// src/routes/action.routes.ts

import { Application } from "express";
import { getEmployees, insert, update, deletion } from "../controllers/employee.controllers";
import { access } from "../auth/access.auth";

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */

/**
 * @swagger
 * /api/get_employees:
 *   get:
 *     summary: Retrieve all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 */

/**
 /**
 * @swagger
 * /api/add_employee:
 *   post:
 *     summary: Add a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empid
 *               - fullname
 *               - designation
 *               - department
 *               - salary
 *               - role
 *             properties:
 *               empid:
 *                 type: integer
 *                 example: 101
 *               profile:
 *                 type: string
 *                 example: /images/profile101.jpg
 *               fullname:
 *                 type: string
 *                 example: Sai Kumar Uppula
 *               designation:
 *                 type: string
 *                 example: Software Engineer
 *               department:
 *                 type: string
 *                 example: IT
 *               salary:
 *                 type: number
 *                 example: 75000
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Employee added successfully
 *       400:
 *         description: Bad request
 */

 /**
 * @swagger
 * /api/update_employee/{id}:
 *   put:
 *     summary: Update an existing employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - designation
 *               - department
 *               - salary
 *             properties:
 *               profile:
 *                 type: string
 *                 example: /images/profile101.jpg
 *               fullname:
 *                 type: string
 *                 example: Sai Kumar Uppula
 *               designation:
 *                 type: string
 *                 example: Senior Developer
 *               department:
 *                 type: string
 *                 example: IT
 *               salary:
 *                 type: number
 *                 example: 185000
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 */


/**
 * @swagger
 * /api/delete_employee/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */

export default function actionRoutes(app: Application): void {
  app.get("/api/get_employees", access, getEmployees);
  app.post("/api/add_employee", access, insert);
  app.put("/api/update_employee/:id", access, update);
  app.delete("/api/delete_employee/:id", access, deletion);
}
