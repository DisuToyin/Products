import { Response } from "express";
import { create_order } from "../src/controllers/order";
import { create_new_order } from "../src/services/order";

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

jest.mock("../src/services/order", () => ({
  create_new_order: jest.fn(),
}));

describe("create_order API endpoint", () => {
  it("should create a new order and return a success response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id", // Assuming you have a user ID in your request object
      },
      {
        user: "656900944158f785e18725fd",
        order_items: [
          {
            quantity: 1,
            product: "6565d37c275fc37d248e2d12",
          },
        ],
      }
    );
    const res = mockResponse();

    // Mock the create_new_order function to resolve with a mock order
    (create_new_order as jest.Mock).mockResolvedValue({
      user: "656900944158f785e18725fd",
      status: "pending",
      order_items: [
        {
          product: "6565d37c275fc37d248e2d12",
          quantity: 1,
          _id: "65690c904158f785e1872609",
          __v: 0,
        },
      ],
      _id: "65690c924158f785e187260b",
    });

    // Act
    await create_order(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user: "656900944158f785e18725fd",
        status: "pending",
        order_items: [
          {
            product: "6565d37c275fc37d248e2d12",
            quantity: 1,
            _id: "65690c904158f785e1872609",
            __v: 0,
          },
        ],
        _id: "65690c924158f785e187260b",
      }),
      message: "Successfully created order",
      success: true,
    });
  });

  it("should handle duplicate order product and return an error response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id", // Assuming you have a user ID in your request object
      },
      {
        user: "656900944158f785e18725fd",
        order_items: [
          {
            quantity: 1,
            product: "6565d37c275fc37d248e2d12",
          },
        ],
      }
    );
    const res = mockResponse();

    // Mock the create_new_order function to reject with a duplicate key error
    (create_new_order as jest.Mock).mockRejectedValue({
      code: 11000, // Simulate a duplicate key error
    });

    // Act
    await create_order(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 11000,
      },
      message: expect.any(String),
      success: false,
    });
  });

  it("should handle internal server error and return an error response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id", // Assuming you have a user ID in your request object
      },
      {
        user: "656900944158f785e18725fd",
        order_items: [
          {
            quantity: 1,
            product: "6565d37c275fc37d248e2d12",
          },
        ],
      }
    );
    const res = mockResponse();

    // Mock the create_new_order function to reject with a generic error
    (create_new_order as jest.Mock).mockRejectedValue("Internal server error");

    // Act
    await create_order(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
