import mongoose, { Document, Model, PopulatedDoc, Schema } from "mongoose";

interface IProduct {
  price: number;
}

interface IOrderItem {
  quantity: number;
  product: PopulatedDoc<IProduct>;
}

interface IOrder {
  user: mongoose.Types.ObjectId;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  order_items: IOrderItem[];
  total: number;
}

interface IOrderDocument extends IOrder, Document {
  populateOrderItems: () => Promise<void>;
}

interface IOrderItemDocument extends IOrderItem, Document {}

interface IOrderModel extends Model<IOrderDocument> {}
interface IOrderItemModel extends Model<IOrderItemDocument> {}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    order_items: [orderItemSchema],
    total: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

orderSchema.methods.calculateTotal = async function () {
  const populatedOrderItems = await OrderItem.populate(this, {
    path: "order_items",
    select: "quantity product", // Include only the necessary fields
  });

  // Convert order_items to an array before calling reduce
  const orderItemsArray = Array.isArray(
    (populatedOrderItems as any).order_items
  )
    ? (populatedOrderItems as any).order_items
    : [];

  // Calculate the total cost based on the quantity and product price
  this.total = orderItemsArray.reduce(
    (total: number, orderItem: IOrderItem) => {
      return (
        total + orderItem.quantity * (orderItem.product as IProduct).price // Assuming the product schema has a "price" field
      );
    },
    0
  );
};

export const OrderItem: IOrderItemModel = mongoose.model<
  IOrderItemDocument,
  IOrderItemModel
>("OrderItem", orderItemSchema);

export const Order: IOrderModel = mongoose.model<IOrderDocument, IOrderModel>(
  "Order",
  orderSchema
);
