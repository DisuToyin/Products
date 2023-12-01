import { Response } from "express";
import { delete_product } from "../src/controllers/product";
import {
  does_user_have_access_to_product,
  delete_product_by_id,
} from "../src/services/product";

import { CustomRequest } from "../src/types";

const mockRequest = (user: any, params: any) =>
  ({
    user,
    params,
  } as CustomRequest);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis(); // Mock the status function
  res.json = jest.fn().mockReturnThis(); // Mock the json function
  return res as Response;
};

jest.mock("../src/services/product", () => ({
  does_user_have_access_to_product: jest.fn(),
  delete_product_by_id: jest.fn(),
}));

describe("delete_product API endpoint", () => {
  it("should delete a product and return a success response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id",
      },
      {
        id: "product_id",
      }
    );
    const res = mockResponse();

    (does_user_have_access_to_product as jest.Mock).mockResolvedValue(true);

    (delete_product_by_id as jest.Mock).mockResolvedValue({
      _id: "product_id",
      name: "Deleted Product",
    });

    // Act
    await delete_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        _id: "product_id",
        name: "Deleted Product",
      }),
      message: "Successfully deleted product",
      success: true,
    });
  });

  it("should handle lack of access and return a forbidden error response", async () => {
    // Arrange
    const req = mockRequest(
      {
        id: "user_id",
      },
      {
        id: "product_id",
      }
    );
    const res = mockResponse();

    // Mock does_user_have_access_to_product to return false
    (does_user_have_access_to_product as jest.Mock).mockResolvedValue(false);

    // Act
    await delete_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "You cant delete this product",
      message:
        "This product does not exist/You are not authorised to delete this product",
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
      }
    );
    const res = mockResponse();

    // Mock does_user_have_access_to_product to reject with an error
    (does_user_have_access_to_product as jest.Mock).mockRejectedValue(
      "Internal server error"
    );

    // Act
    await delete_product(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
      message: expect.any(String),
      success: false,
    });
  });
});
