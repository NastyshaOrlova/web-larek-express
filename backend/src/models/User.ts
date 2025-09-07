import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
        select: false,
      },
    },
  ],
});

export default mongoose.model<IUser>('user', userSchema);
