import { QueryBuilder } from '../../utils/QueryBuilder.js';
import { Status, type TReview } from './review.interface.js';
import { reviewModel } from './review.model.js';

const createReview = async (review: TReview) => {
  const result = await reviewModel.create(review);
  return result;
};
const getReview = async () => {
  const result = await reviewModel
    .find()
    .populate('userID', 'name email')
    .populate('productID', 'title');
  return result;
};

const getReviewbyStatus = async () => {
  const result = await reviewModel
    .find({
      status: Status.approve,
    })
    .populate('userID', 'name email')
    .populate('productID', 'title');

  return result;
};

const getAllReview = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(reviewModel.find(), query);
  const reviewData = queryBuilder
    .filter()
    // .search(userSearchableFields)
    .sort()
    .fields()
    .paginate()
    .apply();

  const [data, meta] = await Promise.all([
    reviewData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleReview = async (id: string) => {
  const result = await reviewModel.findById(id);
  return result;
};

const deleteSingleReview = async (id: string) => {
  const result = await reviewModel.findByIdAndDelete(id);
  return result;
};

const updateSingleReview = async (id: string, updateReview: TReview) => {
  const result = await reviewModel.findByIdAndUpdate(id, updateReview, {
    new: true,
  });
  return result;
};

export const reviewService = {
  createReview,
  getReview,
  getReviewbyStatus,
  getSingleReview,
  deleteSingleReview,
  getAllReview,
  updateSingleReview,
};
