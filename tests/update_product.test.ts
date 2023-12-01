import { Response } from "express";
import { update_product } from "../src/controllers/product";
import {
  does_user_have_access_to_product,
  update_product_by_id,
} from "../src/services/product";

import { CustomRequest } from "../src/types";

const mockRequest = (user: any, params: any, body: any) =>
  ({
    user,
    params,
    body,
  } as CustomRequest);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis(); // Mock the status function
  res.json = jest.fn().mockReturnThis(); // Mock the json function
  return res as Response;
};

jest.mock("../src/services/product", () => ({
  does_user_have_access_to_product: jest.fn(),
  update_product_by_id: jest.fn(),
}));

describe("update_product API endpoint", () => {
  it("should update a product and return a success response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id",
      },
      {
        id: "product_id",
      },
      {
        price: 900,
        description: "For cooking and eating ",
      }
    );
    const res = mockResponse();

    // Mock does_user_have_access_to_product to return true
    (does_user_have_access_to_product as jest.Mock).mockResolvedValue(true);

    // Mock update_product_by_id to resolve with a mock product
    (update_product_by_id as jest.Mock).mockResolvedValue({
      _id: "product_id",
      name: "Updated Product",
      price: 900,
      description: "For cooking and eating ",
    });

    // Act
    await update_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        _id: "product_id",
        name: "Updated Product",
        price: 900,
        description: "For cooking and eating ",
      }),
      message: "Successfully updated product",
      success: true,
    });
  });

  it("should handle lack of access and return a forbidden error response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id", // Assuming you have a user ID in your request object
      },
      {
        id: "product_id", // Assuming you have a product ID in your params object
      },
      {
        price: 900,
        description: "For cooking and eating ",
      }
    );
    const res = mockResponse();

    // Mock does_user_have_access_to_product to return false
    (does_user_have_access_to_product as jest.Mock).mockResolvedValue(false);

    // Act
    await update_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "You cant update this product",
      message:
        "This product does not exist/You are not authorised to update this product",
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
        id: "product_id", // Assuming you have a product ID in your params object
      },
      {
        price: 900,
        description: "For cooking and eating ",
      }
    );
    const res = mockResponse();

    // Mock does_user_have_access_to_product to reject with an error
    (does_user_have_access_to_product as jest.Mock).mockRejectedValue(
      "Internal server error"
    );

    // Act
    await update_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
