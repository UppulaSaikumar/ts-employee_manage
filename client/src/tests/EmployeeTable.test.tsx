import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeTable from "../pages/EmployeeTable";
import { Employee } from "../models/employeeModel/Employee";

const mockEmployees: Employee[] = [
  {
      empid: 1,
      fullname: "Sai kumar",
      designation: "Developer",
      department: "Engineering",
      salary: 100000,
      profile: "",
      role: "admin"
  },
  {
      empid: 2,
      fullname: "Nagendra",
      designation: "Designer",
      department: "UI/UX",
      salary: 90000,
      profile: "",
      role: "employee"
  },
];

describe("EmployeeTable Component", () => {
  let onEdit: ReturnType<typeof vi.fn>;
  let onDelete: ReturnType<typeof vi.fn>;
  let onView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onEdit = vi.fn();
    onDelete = vi.fn();
    onView = vi.fn();
  });

  it("renders table headers and employees", () => {
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    expect(screen.getByText("Employee Directory")).toBeInTheDocument();
    expect(screen.getByText("Sai kumar")).toBeInTheDocument();
    expect(screen.getByText("Nagendra")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(mockEmployees.length + 1);
  });

  it("filters employees based on search input", () => {
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by/i);
    fireEvent.change(searchInput, { target: { value: "sai" } });

    expect(screen.getByText("Sai kumar")).toBeInTheDocument();
    expect(screen.queryByText("Nagendra")).not.toBeInTheDocument();
  });

  it("displays fallback when no matching employees found", () => {
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by/i);
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });

  it("calls onView, onEdit, and onDelete handlers when buttons clicked", () => {
    render(
      <EmployeeTable
        employees={mockEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    const viewButtons = screen.getAllByTitle(/view/i);
    const editButtons = screen.getAllByTitle(/edit/i);
    const deleteButtons = screen.getAllByTitle(/delete/i);

    fireEvent.click(viewButtons[0]);
    fireEvent.click(editButtons[0]);
    fireEvent.click(deleteButtons[0]);

    expect(onView).toHaveBeenCalledWith(1);
    expect(onEdit).toHaveBeenCalledWith(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("shows pagination when employees exceed itemsPerPage", () => {
    const manyEmployees = Array.from({ length: 10 }, (_, index) => ({
      empid: index + 1,
      fullname: `Employee ${index + 1}`,
      designation: "Test",
      department: "Test",
      salary: 50000,
      profile: "",
      role: ""
    }));

    render(
      <EmployeeTable
        employees={manyEmployees}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );

    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(6);
  });
});
