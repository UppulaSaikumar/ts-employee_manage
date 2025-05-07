/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Employees from "../pages/Employees";
import { EmpCon } from "../context/Empcontext";
import { MemoryRouter } from "react-router-dom";

vi.mock("../components/EmployeeServices", () => ({
  GETEMPLOYEES: vi.fn(() =>
    Promise.resolve({
      data: {
        employees: [
          {
            empid: 1,
            fullname: "Sai",
            designation: "Engineer",
            department: "Development",
            salary: 100000,
          },
        ],
      },
    })
  ),
  DELETEEMPLOYEE: vi.fn(),
  LOGOUT: vi.fn(),
}));

const mockContext = {
  isAuthenticated: true,
  setIsAuthenticated: vi.fn(),
  name: "Test employee",
};

const renderWithContext = () =>
  render(
    <EmpCon.Provider value={mockContext as any}>
      <MemoryRouter>
        <Employees />
      </MemoryRouter>
    </EmpCon.Provider>
  );

beforeEach(() => {
  sessionStorage.clear();
});

describe("Employees Component", () => {
  it("renders loading state initially", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "Test employee");
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("empid", "1");

    renderWithContext();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders employee table after loading", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "Test employee");
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("empid", "1");

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByText(/hello Test employee/i)).toBeInTheDocument();
      expect(screen.getByText(/Sai/i)).toBeInTheDocument();
    });
  });

  it("shows Add Employee button only for admin", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "Admin");
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("empid", "1");

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByLabelText(/add employee/i)).toBeInTheDocument();
    });
  });

  it("hides Add Employee button for non-admin", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "Test employee");
    sessionStorage.setItem("role", "employee");
    sessionStorage.setItem("empid", "2");

    renderWithContext();

    await waitFor(() => {
      expect(screen.queryByLabelText(/add employee/i)).not.toBeInTheDocument();
    });
  });

  it("displays logout button", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "Test employee");
    sessionStorage.setItem("role", "employee");
    sessionStorage.setItem("empid", "2");

    renderWithContext();

    await waitFor(() => {
      expect(screen.getByLabelText(/logout/i)).toBeInTheDocument();
    });
  });
});
