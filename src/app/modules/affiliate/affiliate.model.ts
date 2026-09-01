import { Schema, model } from 'mongoose';
import { AffiliateType, type TAffiliate } from './affiliate.interface.js';

const affiliateSchema = new Schema<TAffiliate>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(AffiliateType),
      default: AffiliateType.InActive,
    },
  },
  {
    timestamps: true,
  },
);

export const affiliateModel = model<TAffiliate>('affiliate', affiliateSchema);
