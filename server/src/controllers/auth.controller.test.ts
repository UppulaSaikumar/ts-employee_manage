import request from "supertest";
import express, { Application } from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "../services/auth.services";
import * as authController from "../controllers/auth.controllers";

const app: Application = express();
app.use(express.json());

app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/logout", authController.logout);

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/register").send({ email: "test@gmail.com" });

      expect(res.status).toBe(400);
      expect(res.text).toBe("All fields are required");
    });

    it("should call authService.registerEmployee and return 201", async () => {
      const mockResponse = { message: "Registered successfully" };
      vi.spyOn(authService, "registerEmployee").mockResolvedValue(mockResponse);

      const res = await request(app).post("/api/register").send({
        empid: 1,
        fullname: "Test employee",
        email: "test@gmail.com",
        password: "password123",
      });

      expect(authService.registerEmployee).toHaveBeenCalledWith(
        1,
        "Test employee",
        "test@gmail.com",
        "password123"
      );
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockResponse);
    });

    it("should return 500 on register error", async () => {
      vi.spyOn(authService, "registerEmployee").mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/api/register").send({
        empid: 1,
        fullname: "Test employee",
        email: "test@gmail.com",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.text).toBe("{}");
    });
  });

  describe("login", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/api/login").send({ email: "test@gmail.com" });
      expect(res.status).toBe(400);
      expect(res.text).toBe("All fields are required");
    });

    it("should return 401 on invalid login", async () => {
      vi.spyOn(authService, "loginEmployee").mockResolvedValue({ error: "Invalid credentials" });

      const res = await request(app).post("/api/login").send({
        email: "wrong@gmail.com",
        password: "wrongpass",
      });

      expect(res.status).toBe(401);
      expect(res.text).toBe("Invalid credentials");
    });

    it("should return 200 and set cookie on successful login", async () => {
      const mockResult = {
        token: "mockToken",
        fullname: "Test employee",
        empid: 1,
        role: "admin",
      };

      vi.spyOn(authService, "loginEmployee").mockResolvedValue(mockResult);

      const res = await request(app).post("/api/login").send({
        email: "test@gmail.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: "successful",
        fullname: "Test employee",
        role: "admin",
        empid: 1,
      });
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 500 on login error", async () => {
      vi.spyOn(authService, "loginEmployee").mockRejectedValue(new Error("Login failed"));

      const res = await request(app).post("/api/login").send({
        email: "test@gmail.com",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.text).toBe("Error fetching data");
    });
  });

  describe("logout", () => {
    it("should clear token cookie and return 200", async () => {
      const res = await request(app).post("/api/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful");
    });
  });
});
