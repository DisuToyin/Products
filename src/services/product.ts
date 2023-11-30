import { Product } from "../models/product";

export const does_user_have_access_to_product = async (
  user_id: string,
  product_id: string
): Promise<boolean> => {
  let product = await Product.findOne({ _id: product_id, user_id });
  return Boolean(product);
};

export const create_new_product = async (values: Record<string, any>) => {
  return await Product.create(values);
};

export const get_products_by_user_id = async (user_id: string) => {
  return await Product.find({ user_id }).exec();
};

export const fetch_product_by_id = async (product_id: string) => {
  return await Product.findById(product_id).exec();
};

export const update_product_by_id = async (
  product_id: string,
  updateFields: { name?: string; description?: string; price?: number }
) => {
  const allowedFields = ["name", "description", "price"];

  const validUpdateFields = Object.fromEntries(
    Object.entries(updateFields).filter(([key]) => allowedFields.includes(key))
  );

  const product = await Product.findByIdAndUpdate(
    product_id,
    { $set: validUpdateFields },
    {
      runValidators: true,
      context: "query",
      new: true,
    }
  ).exec();

  return product;
};

export const delete_product_by_id = async (product_id: string) => {
  return await Product.findByIdAndDelete(product_id).exec();
};
