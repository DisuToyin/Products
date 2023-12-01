import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { login } from "../src/controllers/user";
import { find_user } from "../src/services/user";

// Mocking Express Request and Response objects
const mockRequest = (body: any) =>
  ({
    body,
  } as Request);

const mockResponse = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnThis();
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

// Mocking the find_user function
jest.mock("../src/services/user", () => ({
  find_user: jest.fn(),
}));

describe("login API endpoint", () => {
  it("should login a user and return a success response", async () => {
    // Arrange
    const req = mockRequest({
      email: "test@example.com",
      password: "password123",
    });
    const res = mockResponse();

    // Mock the find_user function to resolve with a mock user
    (find_user as jest.Mock).mockResolvedValue({
      _id: "user_id",
      email: "test@example.com",
      password: bcrypt.hashSync("password123", 10),
      accessToken: jest.fn(),
      refreshToken: jest.fn(),
    });

    // Mock bcrypt.compareSync to always return true for the test
    jest.spyOn(bcrypt, "compareSync").mockReturnValue(true);

    // Act
    await login(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user: expect.objectContaining({
          _id: "user_id",
          email: "test@example.com",
          // Add other expected user properties here
        }),
      }),
      message: "Success",
      success: true,
    });
  });

  it("should handle invalid credentials and return an error response", async () => {
    // Arrange
    const req = mockRequest({
      email: "invalid@example.com",
      password: "invalidpassword",
    });
    const res = mockResponse();

    // Mock the find_user function to resolve with no user (invalid credentials)
    (find_user as jest.Mock).mockResolvedValue(null);

    // Act
    await login(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid credentials",
      message: "The provided email or password is incorrect.",
      success: false,
    });
  });

  it("should handle internal server error and return an error response", async () => {
    // Arrange
    const req = mockRequest({
      email: "test@example.com",
      password: "password123",
    });
    const res = mockResponse();

    // Mock the find_user function to reject with an error
    (find_user as jest.Mock).mockRejectedValue("Internal server error");

    // Act
    await login(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
