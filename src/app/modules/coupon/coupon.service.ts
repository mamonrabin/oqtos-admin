import { QueryBuilder } from '../../utils/QueryBuilder.js';
import { couponSearchableFields } from './coupon.constant.js';
import type { TCoupon } from './coupon.interface.js';
import { couponModel } from './coupon.model.js';

const createCoupon = async (coupon: TCoupon) => {
  const result = await couponModel.create(coupon);
  return result;
};
const getAllCoupon = async () => {
  const result = await couponModel.find();
  return result;
};

const getAllCouponByFilter = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    couponModel.find(),
    query,
  );
  const couponesData = queryBuilder
    .filter()
    .search(couponSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    couponesData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleCoupon = async (id: string) => {
  const result = await couponModel.findById(id);
  return result;
};

const getCouponByCode = async (code: string) => {
  const result = await couponModel.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  return result;
};

const updateSingleCoupon = async (id: string, updateCoupon: TCoupon) => {
  const result = await couponModel.findByIdAndUpdate(id, updateCoupon, {
    new: true,
  });
  return result;
};

const deleteSingleCoupon = async (id: string) => {
  const result = await couponModel.findByIdAndDelete(id);
  return result;
};

/* ---------- Increase Coupon Used Count ---------- */
const increaseCouponUsed = async (id: string) => {
  const result = await couponModel.findByIdAndUpdate(
    id,
    { $inc: { used: 1 } },
    { new: true },
  );
  return result;
};

export const couponService = {
  createCoupon,
  getAllCoupon,
  getAllCouponByFilter,
  getSingleCoupon,
  getCouponByCode,
  updateSingleCoupon,
  deleteSingleCoupon,
  increaseCouponUsed,
};
