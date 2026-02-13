import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Workouts from "../app/pages/workouts/page";

describe("Workouts Page", () => {
  it("renders the workouts heading", () => {
    render(<Workouts />);
    
    const heading = screen.getByRole("heading", { name: /workouts/i });

    expect(heading).toBeInTheDocument();
  });
});
