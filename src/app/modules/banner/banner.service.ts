import { Status, type TBanner } from './banner.interface.js';
import { bannerModel } from './banner.model.js';

const createBanner = async (banner: TBanner) => {
  const result = await bannerModel.create(banner);
  return result;
};
const getAllBanner = async () => {
  const result = await bannerModel.find().populate('category', 'categoryName slug');
  return result;
};
const getActiveAllBanner = async () => {
  const result = await bannerModel.find({
    status: {
        $nin: [Status.InActive],
      },
  }).populate('category', 'categoryName slug');
  return result;
};

// const getAllStaffs = async () => {
//   const data = await userModel
//     .find({
//       role: {
//         $nin: [Role.USER, Role.SUPER_ADMIN],
//       },
//     })
//     .sort({ createdAt: -1 });

//   return data;
// };

const updateSingleBanner = async (id: string, updateBanner: TBanner) => {
  const result = await bannerModel.findByIdAndUpdate(id, updateBanner, {
    new: true,
  });
  return result;
};

const deleteSingleBanner = async (id: string) => {
  const result = await bannerModel.findByIdAndDelete(id);
  return result;
};

export const bannerService = {
  createBanner,
  getAllBanner,
  getActiveAllBanner,
  updateSingleBanner,
  deleteSingleBanner,
};
