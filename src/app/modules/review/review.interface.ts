import type { ObjectId } from 'mongoose';


export enum Status {
  Pending = 'Pending',
  Approve = 'Approve',
}

export type TReview = {
  userID: ObjectId;
  productID: ObjectId;
  rating: number;
  images?: string[];
  comment?: string;
  status?: Status;
};
