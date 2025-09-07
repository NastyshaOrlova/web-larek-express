import fs from 'fs';
import mongoose, { Document, Schema } from 'mongoose';
import path from 'path';

export interface IProduct extends Document {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

// eslint-disable-next-line prefer-arrow-callback
productSchema.post('deleteOne', function deleteProductFile(doc: IProduct) {
  if (doc && doc.image && doc.image.fileName) {
    const fileName: string = path.basename(doc.image.fileName);
    const filePath: string = path.join('uploads/products', fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

export default mongoose.model<IProduct>('product', productSchema);
