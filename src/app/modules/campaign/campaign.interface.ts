import type { ObjectId } from 'mongoose';

export enum Status {
  Active = 'Active',
  InActive = 'InActive',
}

export enum CampaignType {
  Flash_Sale = 'Flash_Sale',
  Eid_Sale = 'Eid_Sale',
  Black_friday = 'Black_friday',
  Summer_sale = ' Summer_sale',
}
export enum CouponType {
  product = 'product',
  brand = 'brand',
  category = 'category',
  subCategory = ' subCategory',
}

export type TCampaign = {
  title: string;
  campaigntype: CampaignType;
  couponId: ObjectId;
  couponType: CouponType;
  products?: ObjectId[];
  categoryID?: ObjectId;
  subCategoryID?: ObjectId;
  brandID?: ObjectId;
  image?: string;
  status: Status;
};
