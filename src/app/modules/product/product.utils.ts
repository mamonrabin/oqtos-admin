/* eslint-disable @typescript-eslint/no-explicit-any */
import { reviewModel } from '../review/review.model.js';

export const addReviewStats = async (products: any[]) => {
  const productIds = products.map((product) => product._id);

  const reviews = await reviewModel.aggregate([
    {
      $match: {
        productID: { $in: productIds },
        status: 'approve',
      },
    },
    {
      $group: {
        _id: '$productID',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return products.map((product) => {
    const review = reviews.find(
      (item) => item._id.toString() === product._id.toString(),
    );

    return {
      ...product.toObject(),
      averageRating: review?.averageRating
        ? Number(review.averageRating.toFixed(1))
        : 0,
      totalReviews: review?.totalReviews || 0,
    };
  });
};