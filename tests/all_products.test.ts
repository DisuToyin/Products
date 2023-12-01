import { Response } from "express";
import { get_all_user_products } from "../src/controllers/product";
import { get_products_by_user_id } from "../src/services/product";

import { CustomRequest } from "../src/types";

// Mocking Express Request and Response objects
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

jest.mock("../src/services/product", () => ({
  get_products_by_user_id: jest.fn(),
}));

describe("get_all_user_products API endpoint", () => {
  it("should fetch all user products and return a success response", async () => {
    // Arrange
    const req = mockRequest({
      id: "user_id",
    });
    const res = mockResponse();

    // Mock the get_products_by_user_id function to resolve with mock products
    (get_products_by_user_id as jest.Mock).mockResolvedValue([
      {
        _id: "product_id_1",
        name: "Product 1",
        user_id: "656900944158f785e18725fd",
        description: "xx",
        price: 70000,
      },
    ]);

    // Act
    await get_all_user_products(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        {
          _id: "product_id_1",
          name: "Product 1",
          user_id: "656900944158f785e18725fd",
          description: "xx",
          price: 70000,
        },
      ],
      message: "Successfully fetched products",
      success: true,
    });
  });

  it("should handle internal server error and return an error response", async () => {
    // Arrange
    const req = mockRequest({
      id: "user_id", // Assuming you have a user ID in your request object
    });
    const res = mockResponse();

    // Mock the get_products_by_user_id function to reject with a generic error
    (get_products_by_user_id as jest.Mock).mockRejectedValue(
      "Internal server error"
    );

    // Act
    await get_all_user_products(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
