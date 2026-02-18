import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchEngine from "../pages/SearchEngine";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("SearchEngine Component", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_SERPAPI_KEY", "test-key");
  });

  it("renders the search engine page with Google logo", () => {
    render(
      <BrowserRouter>
        <SearchEngine />
      </BrowserRouter>
    );

    // Check for Google text in the logo
    const logoChars = ["G", "o", "o", "g", "l", "e"];
    logoChars.forEach(char => {
      const elements = screen.getAllByText(char);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("renders the search input", () => {
    render(
      <BrowserRouter>
        <SearchEngine />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Search the web")).toBeInTheDocument();
  });
});
