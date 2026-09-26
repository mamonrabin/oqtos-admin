import { model, Schema } from 'mongoose';
import type { TWishlist } from './wishlist.interface.js';

const wishlistSchema = new Schema<TWishlist>(
  {
    userRef: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    productRef: [
      {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const wishlistModel = model<TWishlist>('wishlist', wishlistSchema);
