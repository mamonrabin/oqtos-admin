import { AffiliateType, type TAffiliate } from './affiliate.interface.js';
import { affiliateModel } from './affiliate.model.js';

const createAffiliate = async (affiliate: TAffiliate) => {
  const result = await affiliateModel.create(affiliate);
  return result;
};
const getAllAffiliate = async () => {
  const result = await affiliateModel.find();
  return result;
};
const getAllAciveAffiliate = async () => {
  const result = await affiliateModel.find({
    type: {
      $nin: [AffiliateType.InActive],
    },
  });
  return result;
};

const getSingleAffiliate = async (id: string) => {
  const result = await affiliateModel.findById(id);
  return result;
};

const updateSingleAffiliate = async (id: string, updateData: TAffiliate) => {
  const result = await affiliateModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteSingleAffiliate = async (id: string) => {
  const result = await affiliateModel.findByIdAndDelete(id);
  return result;
};

export const affiliateService = {
  createAffiliate,
  getAllAffiliate,
  getAllAciveAffiliate,
  getSingleAffiliate,
  updateSingleAffiliate,
  deleteSingleAffiliate,
};
