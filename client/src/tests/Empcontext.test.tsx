import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EmpProvider, EmpCon } from "../context/Empcontext";

describe("EmpProvider", () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    setItemSpy = vi.spyOn(window.sessionStorage.__proto__, "setItem");
    removeItemSpy = vi.spyOn(window.sessionStorage.__proto__, "removeItem");
  });

  const TestComponent = () => {
    const context = React.useContext(EmpCon);
    if (!context) return null;

    const { name, isAuthenticated, setIsAuthenticated } = context;

    return (
      <>
        <div data-testid="name">{name}</div>
        <div data-testid="auth">{isAuthenticated ? "true" : "false"}</div>
        <button
          onClick={() =>
            (setIsAuthenticated as (status: boolean, fullname: string | null) => void)(
              true,
              "Test employee"
            )
          }
        >
          Login
        </button>
        <button
          onClick={() =>
            (setIsAuthenticated as (status: boolean, fullname: string | null) => void)(
              false,
              null
            )
          }
        >
          Logout
        </button>
      </>
    );
  };

  it("sets authentication and updates sessionStorage on login", () => {
    render(
      <EmpProvider>
        <TestComponent />
      </EmpProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByTestId("name").textContent).toBe("Test employee");
    expect(screen.getByTestId("auth").textContent).toBe("true");

    expect(setItemSpy).toHaveBeenCalledWith("Employee", "Test employee");
    expect(setItemSpy).toHaveBeenCalledWith("auth-emp", "true");
  });

  it("clears sessionStorage on logout", () => {
    render(
      <EmpProvider>
        <TestComponent />
      </EmpProvider>
    );
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("name").textContent).toBe("");
    expect(screen.getByTestId("auth").textContent).toBe("false");

    expect(removeItemSpy).toHaveBeenCalledWith("Employee");
    expect(removeItemSpy).toHaveBeenCalledWith("auth-emp");
  });
});
