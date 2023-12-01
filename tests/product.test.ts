import { Response } from "express";
import { create_product } from "../src/controllers/product";
import { create_new_product } from "../src/services/product";

import { CustomRequest } from "../src/types";

// Mocking Express Request and Response objects
const mockRequest = (body: any, user: any) =>
  ({
    body,
    user,
  } as CustomRequest);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis(); // Mock the status function
  res.json = jest.fn().mockReturnThis(); // Mock the json function
  return res as Response;
};

// Mocking the create_new_product function
jest.mock("../src/services/product", () => ({
  create_new_product: jest.fn(),
}));

describe("create_product API endpoint", () => {
  it("should create a new product and return a success response", async () => {
    // Arrange
    const req = mockRequest(
      {
        name: "Benz1",
        description: "xx",
        price: 70000,
      },
      {
        id: "user_id", // Assuming you have a user ID in your request object
      }
    );
    const res = mockResponse();

    // Mock the create_new_product function to resolve with a mock product
    (create_new_product as jest.Mock).mockResolvedValue({
      _id: "product_id",
      user_id: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
    });

    // Act
    await create_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        _id: "product_id",
        user_id: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        // Add other expected product properties here
      }),
      message: "Successfully created product",
      success: true,
    });
  });

  it("should handle duplicate product name and return an error response", async () => {
    // Arrange
    const req = mockRequest(
      {
        name: "Benz1",
        description: "xx",
        price: 70000,
      },
      {
        id: "user_id",
      }
    );
    const res = mockResponse();

    // Mock the create_new_product function to reject with a duplicate key error
    (create_new_product as jest.Mock).mockRejectedValue({
      code: 11000, // Simulate a duplicate key error
    });

    // Act
    await create_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: expect.any(String),
      success: false,
      error: {
        code: 11000,
      },
    });
  });

  it("should handle internal server error and return an error response", async () => {
    // Arrange
    const req = mockRequest(
      {
        name: "Benz1",
        description: "xx",
        price: 70000,
      },

      {
        id: "user_id", // Assuming you have a user ID in your request object
      }
    );
    const res = mockResponse();

    // Mock the create_new_product function to reject with a generic error
    (create_new_product as jest.Mock).mockRejectedValue(
      "Internal server error"
    );

    // Act
    await create_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
