import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeActions from "../components/EmployeeActions";

describe("EmployeeActions Component", () => {
  const empid = 123;
  let onEdit: ReturnType<typeof vi.fn>;
  let onDelete: ReturnType<typeof vi.fn>;
  let onView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onEdit = vi.fn();
    onDelete = vi.fn();
    onView = vi.fn();
    sessionStorage.clear();
  });

  const setup = () => {
    render(
      <EmployeeActions
        empid={empid}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    );
  };

  it("renders all action buttons", () => {
    setup();

    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("disables Edit/Delete buttons if employee is not admin and not the same employee", () => {
    sessionStorage.setItem("role", "employee");
    sessionStorage.setItem("empid", "999");
    setup();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled(); 
    expect(buttons[1]).toBeDisabled(); 
    expect(buttons[2]).not.toBeDisabled();
  });

  it("enables Edit/Delete buttons if employee is admin", () => {
    sessionStorage.setItem("role", "admin");
    setup();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).not.toBeDisabled();
  });

  it("enables Edit/Delete buttons if employee is the same employee", () => {
    sessionStorage.setItem("role", "employee");
    sessionStorage.setItem("empid", empid.toString());
    setup();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toBeDisabled(); 
    expect(buttons[1]).not.toBeDisabled(); 
  });

  it("calls onEdit, onDelete, and onView when buttons are clicked", () => {
    sessionStorage.setItem("role", "admin");
    setup();

    const [editBtn, deleteBtn, viewBtn] = screen.getAllByRole("button");

    fireEvent.click(editBtn);
    fireEvent.click(deleteBtn);
    fireEvent.click(viewBtn);

    expect(onEdit).toHaveBeenCalledWith(empid);
    expect(onDelete).toHaveBeenCalledWith(empid);
    expect(onView).toHaveBeenCalledWith(empid);
  });
});
