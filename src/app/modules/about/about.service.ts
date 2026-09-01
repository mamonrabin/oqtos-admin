import { AboutType, type TAbout } from "./about.interface.js";
import { aboutModel } from "./about.model.js";





const createAbout = async (about: TAbout) => {
  const result = await aboutModel.create(about);
  return result;
};
const getAllAbout = async () => {
  const result = await aboutModel.find();
  return result;
};
const getAllActiveAbout = async () => {
  const result = await aboutModel.find({
      type: {
          $nin: [AboutType.InActive],
        },
    });
  return result;
};

const updateSingleAbout = async (
  id: string,
  updateAbout: TAbout,
) => {
  const result = await aboutModel.findByIdAndUpdate(id, updateAbout, {
    new: true,
  });
  return result;
};



const deleteSingleAbout = async (id: string) => {
  const result = await aboutModel.findByIdAndDelete(id);
  return result;
};

export const aboutService = {
  createAbout,
  getAllAbout,
  getAllActiveAbout,
  updateSingleAbout,
  deleteSingleAbout,
};
