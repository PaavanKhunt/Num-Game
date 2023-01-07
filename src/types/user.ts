import { ObjectId } from 'mongodb';
import mongoose, { Model } from 'mongoose';

export interface User {
  _id: ObjectId;
  name: string;
  inactive: boolean;
}
// export const users: User[] = [];

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  inactive: {
    type: Boolean,
    required: true,
  },
});

const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export { UserModel };
