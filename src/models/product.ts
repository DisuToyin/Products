import mongoose, { Document, Model } from "mongoose";

// Interface for the document (instance of the model)
interface IProductDocument extends Document {
  user_id: mongoose.Schema.Types.ObjectId; // Reference to User model
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the model (static methods and properties)
interface IProductModel extends Model<IProductDocument> {}

const productSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: false,
    },

    description: {
      type: String,
      required: false,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure compound unique index for user_id and name
productSchema.index({ user_id: 1, name: 1 }, { unique: true });

export const Product: IProductModel = mongoose.model<
  IProductDocument,
  IProductModel
>("Product", productSchema);
