import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Login from "./Login";

// Mock axios and UserContext
jest.mock("axios");
jest.mock("../../context/UserContext", () => ({
  useUserContext: () => ({
    loginUser: jest.fn(),
  }),
}));

// Utility wrapper for router
const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("Login Page", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // 🧩 Test 1: Renders login form
  test("renders login form correctly", () => {
    render(<Login />, { wrapper: Wrapper });

    expect(screen.getByText(/Login to Your Account/i)).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // 🧩 Test 2: Shows error message on failed login
  test("shows error message if login fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />, { wrapper: Wrapper });

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  // 🧩 Test 3: Redirects user on successful login (student)
  test("redirects user on successful login (student)", async () => {
    const mockUser = { role: "student", email: "test@user.com" };
    axios.post.mockResolvedValueOnce({
      data: { token: "fakeToken", user: mockUser },
    });

    render(<Login />, { wrapper: Wrapper });

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@user.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fakeToken");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      expect(storedUser.role).toBe("student");
    });
  });

  // 🧩 Test 4: Shows "Login failed" when no message from backend
  test("shows generic error when backend fails without message", async () => {
    axios.post.mockRejectedValueOnce({
      response: {},
    });

    render(<Login />, { wrapper: Wrapper });

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });
});
