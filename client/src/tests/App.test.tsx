/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { EmpCon } from "../context/Empcontext";

beforeEach(() => {
  sessionStorage.clear();
});

vi.mock("../components/EmployeeServices", () => ({
  GETEMPLOYEES: vi.fn(() => Promise.resolve({ data: { employees: [] } })),
  DELETEEMPLOYEE: vi.fn(),
  LOGOUT: vi.fn(),
}));

function renderWithEmpContext(
  ui: React.ReactNode,
  { isAuthenticated, name = "Ram" }: { isAuthenticated: boolean; name?: string }
) {
  const mockContext = {
    isAuthenticated,
    setIsAuthenticated: vi.fn(),
    name,
  };

  return render(
    <EmpCon.Provider value={mockContext as any}>{ui}</EmpCon.Provider>
  );
}

describe("App Routing with PrivateRoute logic", () => {
  it("shows login page on /login route", () => {
    window.history.pushState({}, "Login Page", "/login");

    renderWithEmpContext(<App />, { isAuthenticated: false });

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Forgot password?/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign up/i })).toBeInTheDocument();
  });

  it("redirects to login when accessing / while unauthenticated", () => {
    window.history.pushState({}, "Home", "/");

    renderWithEmpContext(<App />, { isAuthenticated: false });

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Forgot password?/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign up/i })).toBeInTheDocument();
  });

  it("renders Employees page with greeting and logout button when authenticated", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "Ram");
    sessionStorage.setItem("role", "employee");
    sessionStorage.setItem("empid", "123");

    window.history.pushState({}, "Home", "/");

    renderWithEmpContext(<App />, { isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText(/hello ram/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/logout/i)).toBeInTheDocument();
      expect(screen.getByText(/ID/i)).toBeInTheDocument();
      expect(screen.getByText(/Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Employee Directory/i)).toBeInTheDocument();
      expect(screen.getByText(/Designation/i)).toBeInTheDocument();
      expect(screen.getByText(/Department/i)).toBeInTheDocument();
      expect(screen.getByText(/Salary/i)).toBeInTheDocument();
      expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    });
  });

  it("shows Add Employee button only for admin users", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "AdminUser");
    sessionStorage.setItem("role", "admin");
    sessionStorage.setItem("empid", "1");

    window.history.pushState({}, "Home", "/");

    renderWithEmpContext(<App />, { isAuthenticated: true, name: "AdminUser" });

    await waitFor(() => {
      expect(screen.getByLabelText(/add employee/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/logout/i)).toBeInTheDocument();
  });

  it("hides Add Employee button for non-admin users", async () => {
    sessionStorage.setItem("auth-emp", "true");
    sessionStorage.setItem("Employee", "NormalUser");
    sessionStorage.setItem("role", "employee");
    sessionStorage.setItem("empid", "2");

    window.history.pushState({}, "Home", "/");

    renderWithEmpContext(<App />, {
      isAuthenticated: true,
      name: "NormalUser",
    });

    await waitFor(() => {
      expect(screen.getByText(/hello normaluser/i)).toBeInTheDocument();
    });
    expect(screen.queryByLabelText(/add employee/i)).not.toBeInTheDocument();
  });
});