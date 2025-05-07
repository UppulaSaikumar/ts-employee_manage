import request from "supertest";
import express, { Application } from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as employeeController from "../controllers/employee.controllers";
import * as employeeService from "../services/employee.services";

const app: Application = express();
app.use(express.json());

app.get("/api/employees", employeeController.getEmployees);
app.post("/api/employees", employeeController.insert);
app.put("/api/employees/:id", employeeController.update);
app.delete("/api/employees/:id", employeeController.deletion);

describe("Employee Controller", () => {
  const mockEmployee = {
    empid: 1,
    profile: "img.jpg",
    fullname: "Nagendra",
    designation: "Developer",
    department: "IT",
    salary: 50000,
    role: "employee",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/employees should return list of employees", async () => {
    vi.spyOn(employeeService, "getAllEmployees").mockResolvedValue([mockEmployee]);

    const res = await request(app).get("/api/employees");
    expect(res.status).toBe(200);
    expect(res.body.employees).toEqual([mockEmployee]);
  });

  it("POST /api/employees should return 400 if required fields missing", async () => {
    const res = await request(app).post("/api/employees").send({
      fullname: "Incomplete",
      designation: "Dev",
    });

    expect(res.status).toBe(400);
    expect(res.text).toBe("All fields are required");
  });

  it("POST /api/employees should save employee and return 201", async () => {
    vi.spyOn(employeeService, "insertEmployee").mockResolvedValue();

    const res = await request(app).post("/api/employees").send(mockEmployee);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Data saved successfully");
  });

  it("PUT /api/employees/:id should return 400 if fields are missing", async () => {
    const res = await request(app).put("/api/employees/1").send({
      designation: "Dev",
    });

    expect(res.status).toBe(400);
    expect(res.text).toBe("All fields are required");
  });

  it("PUT /api/employees/:id should update employee and return 200", async () => {
    vi.spyOn(employeeService, "updateEmployee").mockResolvedValue();

    const res = await request(app).put("/api/employees/1").send({
      profile: "img.jpg",
      fullname: "Updated Employee",
      designation: "Lead",
      department: "IT",
      salary: 60000,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Data updated successfully");
  });

  it("PUT /api/employees/:id should return 404 if employee not found", async () => {
    vi.spyOn(employeeService, "updateEmployee").mockRejectedValue(new Error("Employee not found"));

    const res = await request(app).put("/api/employees/999").send({
      profile: "img.jpg",
      fullname: "Ghost",
      designation: "Dev",
      department: "HR",
      salary: 10000,
    });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Employee not found");
  });

  it("DELETE /api/employees/:id should delete employee and return 200", async () => {
    vi.spyOn(employeeService, "deleteEmployee").mockResolvedValue();

    const res = await request(app).delete("/api/employees/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Data deleted successfully");
  });

  it("DELETE /api/employees/:id should return 500 on error", async () => {
    vi.spyOn(employeeService, "deleteEmployee").mockRejectedValue(new Error("Delete failed"));

    const res = await request(app).delete("/api/employees/2");
    expect(res.status).toBe(500);
    expect(res.text).toBe("Error deleting data");
  });
});
