import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmployeeModal from "../components/EmployeeModal";
import { Employee } from "../models/employeeModel/Employee";

describe("EmployeeModal", () => {
  const mockEmployee: Employee = {
    empid: 1,
    fullname: "Nagendra",
    designation: "Developer",
    department: "Engineering",
    salary: 75000,
    role: "employee",
    profile: " ",
    email: "nagendra@gmail.com",
    password: "nagendra@123",
    created_at: "2025-04-17T10:33:15.963Z",
    updated_at: "2025-04-17T10:35:15.963Z",
  };

  it("renders nothing when no employee is passed", () => {
    const { container } = render(
      <EmployeeModal employee={null} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders employee details when employee is passed", () => {
    render(<EmployeeModal employee={mockEmployee} onClose={vi.fn()} />);

    expect(screen.getByText("Employee Details")).toBeInTheDocument();
    expect(screen.getByText(/Nagendra/)).toBeInTheDocument();
    expect(screen.getByText(/Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Engineering/)).toBeInTheDocument();
    expect(screen.getByText(/₹75000/)).toBeInTheDocument();

    expect(screen.getByText(/Created At:/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-04-17T10:33:15.963Z/i)).toBeInTheDocument();

    expect(screen.getByText(/Last Updated:/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-04-17T10:35:15.963Z/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Close/i })).toBeInTheDocument();
  });

  it("calls onClose when the Close button is clicked", () => {
    const handleClose = vi.fn();
    render(<EmployeeModal employee={mockEmployee} onClose={handleClose} />);

    fireEvent.click(screen.getByRole("button", { name: /Close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
