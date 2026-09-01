import { CampaignType, Status, type TCampaign } from './campaign.interface.js';
import { campaignModel } from './campaign.model.js';

const createCampaign = async (campaign: TCampaign) => {
  const result = await campaignModel.create(campaign);
  return result;
};
const getAllCampaign = async () => {
  const result = await campaignModel
    .find()
    .populate('couponId')
    .populate('products')
    .populate('categoryID')
    .populate('subCategoryID')
    .populate('brandID');
  return result;
};
const getflashSale = async () => {
  const result = await campaignModel
    .findOne({
      campaigntype: CampaignType.Flash_Sale,
      status: Status.Active,
    })
    .populate('couponId')
    .populate({
      path: 'products',
      populate: [
        {
          path: 'category',
          select: 'categoryName',
        },
        {
          path: 'subCategory',
          select: 'subcategoryName',
        },
        {
          path: 'brand',
          select: 'title',
        },
      ],
    })
    .populate('categoryID', 'categoryName')
    .populate('subCategoryID', 'subcategoryName')
    .populate('brandID', 'title');
  return result;
};

const getSingleCampaign = async (id: string) => {
  const result = await campaignModel
    .findById(id)
    .populate('couponId')
    .populate('products')
    .populate('categoryID', 'categoryName')
    .populate('subCategoryID', 'subcategoryName')
    .populate('brandID', 'title');
  return result;
};

const updateSingleCampaign = async (id: string, updateCampaign: TCampaign) => {
  const result = await campaignModel.findByIdAndUpdate(id, updateCampaign, {
    new: true,
  });
  return result;
};

const deleteSingleCampaign = async (id: string) => {
  const result = await campaignModel.findByIdAndDelete(id);
  return result;
};

export const campaignService = {
  createCampaign,
  getAllCampaign,
  getflashSale,
  getSingleCampaign,
  updateSingleCampaign,
  deleteSingleCampaign,
};
