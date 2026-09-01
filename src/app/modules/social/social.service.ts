import { Status, type TSocialIcon } from './social.interface.js';
import { socialIconModel } from './social.model.js';

const createSocialIcon = async (socialIcon: TSocialIcon) => {
  const result = await socialIconModel.create(socialIcon);
  return result;
};
const getAllSocialIcon = async () => {
  const result = await socialIconModel.find();
  return result;
};

const getActiveAllSocialIcon = async () => {
  const result = await socialIconModel.find({
    status: {
        $nin: [Status.InActive],
      },
  });
  return result;
};

const updateSingleSocialIcon = async (
  id: string,
  updateSocialIcon: TSocialIcon,
) => {
  const result = await socialIconModel.findByIdAndUpdate(id, updateSocialIcon, {
    new: true,
  });
  return result;
};

const deleteSingleSocialIcon = async (id: string) => {
  const result = await socialIconModel.findByIdAndDelete(id);
  return result;
};

export const socialIconService = {
  createSocialIcon,
  getAllSocialIcon,
  getActiveAllSocialIcon,
  updateSingleSocialIcon,
  deleteSingleSocialIcon,
};
