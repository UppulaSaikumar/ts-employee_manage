/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CredentialsSignInPage from "../pages/CredentialsSignInPage";
import { EmpCon } from "../context/Empcontext";
import { LOGIN } from "../components/EmployeeServices";

vi.mock("../components/EmployeeServices", async () => {
  const mod = await vi.importActual<any>("../components/EmployeeServices");
  return {
    ...mod,
    LOGIN: vi.fn(),
    LOGOUT: vi.fn(),
  };
});

function renderWithEmpContext(ui: React.ReactNode, contextOverrides = {}) {
  const defaultContext = {
    isAuthenticated: false,
    setIsAuthenticated: vi.fn(),
    name: "",
  };

  return render(
    <BrowserRouter>
      <EmpCon.Provider value={{ ...defaultContext, ...contextOverrides } as any}>
        {ui}
      </EmpCon.Provider>
    </BrowserRouter>
  );
}

describe("CredentialsSignInPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("renders login form UI elements", () => {
    renderWithEmpContext(<CredentialsSignInPage />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it("submits login form and handles success response", async () => {
    const mockSetAuth = vi.fn();
    (LOGIN as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        fullname: "Devi",
        message: "successful",
        empid: 1,
        role: "admin",
      },
      status: 200,
    });

    renderWithEmpContext(<CredentialsSignInPage />, {
      setIsAuthenticated: mockSetAuth,
    });

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'devi@gmail.com' },
      });
      
      fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
        target: { value: 'devi@123' },
      });
      

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(LOGIN).toHaveBeenCalledWith({
        email: "devi@gmail.com",
        password: "devi@123",
      });

      expect(mockSetAuth).toHaveBeenCalledWith(true, "Devi");

      expect(sessionStorage.getItem("Employee")).toBe("Devi");
      expect(sessionStorage.getItem("auth-emp")).toBe("true");
      expect(sessionStorage.getItem("empid")).toBe("1");
      expect(sessionStorage.getItem("role")).toBe("admin");
    });
  });

  it("shows error on login failure (wrong credentials)", async () => {
    (LOGIN as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 401,
      data: { message: "Invalid credentials" },
    });

    renderWithEmpContext(<CredentialsSignInPage />);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'wrong@gmail.com' },
      });
      
      fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
        target: { value: 'pass@123' },
      });
      

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(LOGIN).toHaveBeenCalled();
      expect(screen.getByText(/wrong credentials/i)).toBeInTheDocument();
    });
  });

  it("shows error on login exception (e.g. network error)", async () => {
    (LOGIN as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network Error")
    );

    renderWithEmpContext(<CredentialsSignInPage />);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'fail@gmail.com' },
      });
      
      fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
        target: { value: 'fail@123' },
      });
      

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
