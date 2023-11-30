import { Order, OrderItem } from "../models/order";

export const create_new_order = async (
  values: Record<string, any>,
  user_id: string
) => {
  values.user = user_id;
  const order_items = values.order_items;
  const list_order_products = [];

  for (let item of order_items) {
    let order_product = await new OrderItem(item).save();
    list_order_products.push(order_product);
  }

  values.order_items = list_order_products;
  const order = await new Order(values).save();

  return order;
};

export const has_access_to_order = async (
  user_id: string,
  order_id: string
): Promise<boolean> => {
  let order = await Order.findOne({ _id: order_id, user: user_id });
  return Boolean(order);
};

export const get_user_orders = async (user_id: string) => {
  const orders = await Order.find({ user: user_id })
    .populate({
      path: "order_items",
      populate: {
        path: "product",
        model: "Product", // Replace with the name of your Product model
      },
    })
    .exec();

  return orders;
};

export const order_by_id = async (order_id: string) => {
  const order = await Order.findById(order_id).exec();
  return order;
};

export const get_order_items = async (order_id: string) => {
  const order_items = await OrderItem.find({ order: order_id }).exec();
  return order_items;
};

export const update_order = async (
  order_id: string,
  payload: Record<string, any>
) => {
  const existing_order_items = await get_order_items(order_id);
  let order = null;
  let updated_order_items = [];

  if (payload.status) {
    order = await Order.findByIdAndUpdate(
      order_id,
      { status: payload.status },
      {
        runValidators: true,
        context: "query",
        new: true,
      }
    ).exec();
  }
  if (payload?.order_items) {
    for (let item of payload?.order_items) {
      const order_item_exists = existing_order_items.find(
        (existing_item) => existing_item.product === item.product
      );

      if (order_item_exists) {
        // update such product item
        const order_items_product = await OrderItem.findByIdAndUpdate(
          order_item_exists.id,
          { quantity: item.quantity, product: item.product },
          {
            runValidators: true,
            context: "query",
            new: true,
          }
        ).exec();
        updated_order_items.push(order_items_product);
      } else {
        const order_items_product = await new OrderItem(item).save();
        updated_order_items.push(order_items_product);
      }
    }
  }

  return { order, updated_order_items };
};
