import { model, Schema } from 'mongoose';
import { Status, type TReview } from './review.interface.js';

const reviewSchema = new Schema<TReview>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Pending,
    },
  },
  {
    timestamps: true,
  },
);

export const reviewModel = model<TReview>('review', reviewSchema);
