import { render, screen } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";

const TestComponent = () => <div>Protected Page</div>;
const LoginComponent = () => <div>Login Page</div>;

describe("PrivateRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("redirects to login if not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders child component if authenticated", () => {
    sessionStorage.setItem("auth-emp", "true");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Page")).toBeInTheDocument();
  });
});
