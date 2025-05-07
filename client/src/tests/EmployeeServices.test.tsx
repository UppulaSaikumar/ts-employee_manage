import { describe, it, expect, vi, beforeEach } from "vitest";
import * as EmployeeServices from "../components/EmployeeServices";
import { HttpClient } from "../components/http-service/api";
import { API_LIST } from "../components/http-service/list";

vi.mock("../components/http-service/api", () => ({
  HttpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("EmployeeServices", () => {
  const mockEmployee = {
    empid: 1,
    profile: "",
    fullname: "Devi",
    designation: "Developer",
    department: "IT",
    salary: 50000,
    role: "admin",
    email: "devi@gamil.com",
    password: "devi123",
  };

  const mockUser = {
    empid: 1,
    fullname: "Devi",
    email: "devi@gmail.com",
    password: "devi@123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call GETEMPLOYEES with correct endpoint", () => {
    EmployeeServices.GETEMPLOYEES();
    expect(HttpClient.get).toHaveBeenCalledWith(API_LIST.GETEMPLOYEES);
  });

  it("should call ADDEMPLOYEE with correct endpoint and payload", () => {
    EmployeeServices.ADDEMPLOYEE(mockEmployee);
    expect(HttpClient.post).toHaveBeenCalledWith(API_LIST.ADDEMPLOYEE, mockEmployee);
  });

  it("should call UPDATEEMPLOYEE with correct endpoint and payload", () => {
    EmployeeServices.UPDATEEMPLOYEE(mockEmployee);
    expect(HttpClient.put).toHaveBeenCalledWith(API_LIST.EDITEMPLOYEE, mockEmployee.empid, mockEmployee);
  });

  it("should call DELETEEMPLOYEE with correct endpoint and empid", () => {
    EmployeeServices.DELETEEMPLOYEE(1);
    expect(HttpClient.delete).toHaveBeenCalledWith(API_LIST.DELETEEMPLOYEE, 1);
  });

  it("should call LOGIN with correct endpoint and payload", () => {
    EmployeeServices.LOGIN({ email: mockUser.email, password: mockUser.password });
    expect(HttpClient.post).toHaveBeenCalledWith(API_LIST.LOGIN, {
      email: mockUser.email,
      password: mockUser.password,
    });
  });

  it("should call REGISTER with correct endpoint and payload", () => {
    EmployeeServices.REGISTER(mockUser);
    expect(HttpClient.post).toHaveBeenCalledWith(API_LIST.REGISTER, mockUser);
  });

  it("should call LOGOUT with correct endpoint and payload", () => {
    EmployeeServices.LOGOUT({ empid: 1 });
    expect(HttpClient.post).toHaveBeenCalledWith(API_LIST.LOGOUT, { empid: 1 });
  });
});
