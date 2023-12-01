import { Response } from "express";
import { get_orders } from "../src/controllers/order";
import { get_user_orders } from "../src/services/order";

import { CustomRequest } from "../src/types";

const mockRequest = (user: any) =>
  ({
    user,
  } as CustomRequest);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis(); // Mock the status function
  res.json = jest.fn().mockReturnThis(); // Mock the json function
  return res as Response;
};
jest.mock("../src/services/order", () => ({
  get_user_orders: jest.fn(),
}));

describe("get_orders API endpoint", () => {
  it("should fetch user orders and return a success response", async () => {
    // Arrange
    const req = mockRequest({
      id: "user_id", // Assuming you have a user ID in your request object
    });
    const res = mockResponse();

    // Mock the get_user_orders function to resolve with mock orders
    (get_user_orders as jest.Mock).mockResolvedValue([
      {
        _id: "65690c924158f785e187260b",
        user: "656900944158f785e18725fd",
        status: "pending",
        order_items: [
          {
            product: null,
            quantity: 1,
            _id: "65690c904158f785e1872609",
            __v: 0,
          },
        ],
        createdAt: "2023-11-30T22:28:34.254Z",
        updatedAt: "2023-11-30T22:28:34.254Z",
        __v: 0,
      },
    ]);

    // Act
    await get_orders(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        {
          _id: "65690c924158f785e187260b",
          user: "656900944158f785e18725fd",
          status: "pending",
          order_items: [
            {
              product: null,
              quantity: 1,
              _id: "65690c904158f785e1872609",
              __v: 0,
            },
          ],
          createdAt: "2023-11-30T22:28:34.254Z",
          updatedAt: "2023-11-30T22:28:34.254Z",
          __v: 0,
        },
      ],
      message: "Successfully fetched your orders",
      success: true,
    });
  });

  it("should handle internal server error and return an error response", async () => {
    // Arrange
    const req = mockRequest({
      id: "user_id",
    });
    const res = mockResponse();

    (get_user_orders as jest.Mock).mockRejectedValue("Internal server error");

    // Act
    await get_orders(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
