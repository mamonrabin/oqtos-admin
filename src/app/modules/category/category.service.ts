import { QueryBuilder } from '../../utils/QueryBuilder.js';
import { categorySearchableFields } from './category.constant.js';
import { Status, type TCategory } from './category.interface.js';
import { categoryModel } from './category.model.js';

const createCategory = async (category: TCategory) => {
  const result = await categoryModel.create(category);
  return result;
};
const getAllCategoryWithOutBuilder = async () => {
  const result = await categoryModel.find({
    status: {
      $nin: [Status.InActive],
    },
  });
  return result;
};

const getAllCategory = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(categoryModel.find(), query);
  const categoriesData = queryBuilder
    .filter()
    .search(categorySearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    categoriesData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleCategory = async (id: string) => {
  const result = await categoryModel.findById(id);
  return result;
};

const getSingleCategoryBySlug = async (slug: string) => {
  const result = await categoryModel.findOne({ slug });
  return result;
};

const updateSingleCategory = async (id: string, updateCategory: TCategory) => {
  const result = await categoryModel.findByIdAndUpdate(id, updateCategory, {
    new: true,
  });
  return result;
};

const deleteSingleCategory = async (id: string) => {
  const result = await categoryModel.findByIdAndDelete(id);
  return result;
};

export const categoryService = {
  createCategory,
  getAllCategoryWithOutBuilder,
  getAllCategory,
  getSingleCategory,
  getSingleCategoryBySlug,
  updateSingleCategory,
  deleteSingleCategory,
};
