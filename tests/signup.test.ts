import { Request, Response } from "express";
import { register } from "../src/controllers/user";
import { login } from "../src/controllers/user";

import { create_new_user } from "../src/services/user";
import { find_user } from "../src/services/user";

import bcrypt from "bcryptjs";

// Mocking Express Request and Response objects
const mockRequest = (body: any) =>
  ({
    body,
  } as Request);

const mockResponse = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnThis(); // Mock the cookie function
  res.status = jest.fn().mockReturnThis(); // Mock the status function
  res.json = jest.fn().mockReturnThis(); // Mock the json function
  return res as Response;
};

// Mocking the create_new_user function

jest.mock("../src/services/user", () => ({
  create_new_user: jest.fn(),
}));

describe("Signup", () => {
  it("should register a new user and return a success response", async () => {
    // Arrange

    const req = mockRequest({
      email: "disujt@xyz.co",
      password: "1234567890",
    });
    const res = mockResponse();

    // Mock the create_new_user function to resolve with a mock user
    (create_new_user as jest.Mock).mockResolvedValue({
      accessToken: jest.fn(),
      refreshToken: jest.fn(),
      // Mock other user properties as needed
    });

    // Act
    await register(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user: expect.objectContaining({
          accessToken: expect.any(Function),
          refreshToken: expect.any(Function),
        }),
      }),
      message: "Success",
      success: true,
    });
  });

  it("should handle errors and return an error response", async () => {
    // Arrange
    const req = mockRequest({
      email: "disujt@xyz.co",
      password: "1234567890",
    });
    const res = mockResponse();

    // Mock the create_new_user function to reject with an error
    (create_new_user as jest.Mock).mockRejectedValue({
      code: 11000, // Simulate a duplicate email error
    });

    // Act
    await register(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
        message: expect.any(String),
        success: false,
      })
    );
  });
});
