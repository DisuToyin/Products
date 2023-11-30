import { User } from "../models/user";
type IdentifierType = "email" | "id";

export const create_new_user = async (values: Record<string, any>) => {
  const new_user = await new User(values).save();
  return new_user;
};

export const find_user = async (
  identifierType: IdentifierType,
  identifier: string
): Promise<typeof User | any> => {
  if (identifierType === "email") {
    const userByEmail = await User.findOne({ email: identifier }).exec();
    return userByEmail;
  } else if (identifierType === "id") {
    const userById = await User.findOne({ _id: identifier }).exec();
    return userById;
  } else {
    console.error("Invalid identifierType");
    return null;
  }
};
