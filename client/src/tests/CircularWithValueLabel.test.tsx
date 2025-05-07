import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CircularWithValueLabel from "../components/CircularWithValueLabel";

describe("CircularWithValueLabel", () => {
  it("renders the linear progress bar", () => {
    render(<CircularWithValueLabel />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });
});
