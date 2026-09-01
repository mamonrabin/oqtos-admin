import { model, Schema } from 'mongoose';
import { CampaignType, CouponType, Status, type TCampaign } from './campaign.interface.js';

const campaignSchema = new Schema<TCampaign>(
  {
    title: { type: String, required: true },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
    ],
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
    subCategoryID: {
      type: Schema.Types.ObjectId,
      ref: 'subcategory',
    },
    brandID: {
      type: Schema.Types.ObjectId,
      ref: 'brand',
    },
    image: { type: String },
    couponId: { type: Schema.Types.ObjectId, ref: 'coupon', required: true },
    campaigntype: {
      type: String,
      enum: Object.values(CampaignType),
    },
    couponType: {
      type: String,
      enum: Object.values(CouponType),
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
    },
  },
  {
    timestamps: true,
  },
);

export const campaignModel = model<TCampaign>('campaign', campaignSchema);
