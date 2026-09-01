import type { TCustom } from "./custome-design.interface.js";
import { customeModel } from "./custome-design.model.js";

const createCustome = async (customData: TCustom) => {
  const result = await customeModel.create(customData);

  return result;
};

const getAllCustome = async () => {
  const result = await customeModel.find();

  return result;
};

const getSingleCustome = async (id: string) => {
  const result = await customeModel.findById(id);

  return result;
};

const updateSingleCustome = async (
  id: string,
  updateData: Partial<TCustom>,
) => {
  const updateFields: Record<string, unknown> = {};

  Object.entries(updateData).forEach(([section, values]) => {
    if (
      values &&
      typeof values === "object" &&
      !Array.isArray(values)
    ) {
      Object.entries(values).forEach(([key, value]) => {
        updateFields[`${section}.${key}`] = value;
      });
    } else {
      updateFields[section] = values;
    }
  });

  const result = await customeModel.findByIdAndUpdate(
    id,
    {
      $set: updateFields,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteSingleCustome = async (id: string) => {
  const result = await customeModel.findByIdAndDelete(id);

  return result;
};

export const customeService = {
  createCustome,
  getAllCustome,
  getSingleCustome,
  updateSingleCustome,
  deleteSingleCustome,
};