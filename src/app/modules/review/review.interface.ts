import type { ObjectId } from 'mongoose';


export enum Status {
  pending = 'pending',
  approve = 'approve',
}

export type TReview = {
  userID: ObjectId;
  productID: ObjectId;
  rating: number;
  images?: string[];
  comment?: string;
  status?: Status;
};
