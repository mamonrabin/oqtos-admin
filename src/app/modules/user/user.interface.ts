import type { Types } from 'mongoose';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
}

export interface IAuthProvider {
  provider: 'google' | 'credentials';
  providerId: string;
}

export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum AffiliateStatus {
  Request = 'Request',
  Accepted = 'Accepted',
  Denied = 'Denied',
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  affiliateCoupon?: string;
  affiliateLink?:string[]
  affiliateStatus: AffiliateStatus;
}
