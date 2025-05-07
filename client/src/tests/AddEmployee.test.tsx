/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, beforeEach, it, vi, expect } from "vitest";
import AddEmployee from "../components/AddEmployee";
import { MemoryRouter } from "react-router-dom";
import * as EmployeeServices from "../components/EmployeeServices";

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ state: undefined }),
  };
});

vi.mock("../components/EmployeeServices", () => ({
  ADDEMPLOYEE: vi.fn(),
  REGISTER: vi.fn(),
  UPDATEEMPLOYEE: vi.fn(),
}));

describe("AddEmployee Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders add form correctly", () => {
    render(<AddEmployee />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Employee Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<AddEmployee />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /Add Employee/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Employee ID should be a positive number/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Full Name is required/i)).toBeInTheDocument();
    });
  });

  it("submits form and calls service functions", async () => {
    const mockAdd = EmployeeServices.ADDEMPLOYEE as any;
    const mockRegister = EmployeeServices.REGISTER as any;

    mockAdd.mockResolvedValue({});
    mockRegister.mockResolvedValue({});

    render(<AddEmployee />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Employee Id/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Sai kumar" },
    });
    fireEvent.change(screen.getByLabelText(/Designation/i), {
      target: { value: "Developer" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/Department/i));
    fireEvent.click(screen.getByText("Sales"));
    fireEvent.change(screen.getByLabelText(/Salary/i), {
      target: { value: "50000" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Role/i));
    fireEvent.click(screen.getByText("Admin"));
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "sai@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "sai@123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Employee/i }));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalled();
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});
