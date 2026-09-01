import type { ObjectId } from 'mongoose';
export enum Status {
  Active = 'Active',
  InActive = 'InActive',
}

export type TCoupon = {
  code: string;
  discountType: 'Percentage' | 'flat';
  discount: number;
  useLimit: number;
  startDate: Date;
  expireDate: Date;
  used?: number;
  perUserLimit?: number;
  userInfo?: ObjectId;
  isActive: boolean;
  status: Status;
};
