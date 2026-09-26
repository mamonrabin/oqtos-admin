import type { Status, TThemeColors } from './theme.interface.js';
import { themeModel } from './theme.model.js';

const createTheme = async (theme: TThemeColors) => {
  const result = await themeModel.create(theme);
  return result;
};
const getAllTheme = async () => {
  const result = await themeModel.find().sort({ createdAt: -1 });

  return result;
};

const getThemeByStatus = async (status: Status) => {
  const result = await themeModel.findOne({ status }).sort({ createdAt: -1 });

  return result;
};

const updateSingleTheme = async (id: string, updateTheme: TThemeColors) => {
  const result = await themeModel.findByIdAndUpdate(id, updateTheme, {
    new: true,
  });
  return result;
};

const deleteSingleTheme = async (id: string) => {
  const result = await themeModel.findByIdAndDelete(id);
  return result;
};

export const themeService = {
  createTheme,
  getAllTheme,
  getThemeByStatus,
  updateSingleTheme,
  deleteSingleTheme,
};
