export enum AffiliateType {
  Active = 'Active',
  InActive = 'InActive',
}

export type TAffiliate = {
  description: string;
  type: AffiliateType;
};
