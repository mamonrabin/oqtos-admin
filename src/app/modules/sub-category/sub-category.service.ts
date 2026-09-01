import { QueryBuilder } from '../../utils/QueryBuilder.js';
import { subcategorySearchableFields } from './sub-category.constant.js';
import type { TSubCategory } from './sub-category.interface.js';
import { subcategoryModel } from './sub-category.model.js';

const createSubCategor = async (subcategory: TSubCategory) => {
  const result = await subcategoryModel.create(subcategory);
  return result;
};
// const getAllSubCategoryWithOutBuilder = async () => {
//   const result = await subcategoryModel.find().populate("category","categoryName slug");
//   return result;
// };

const getAllSubCategoryWithOutBuilder = async () => {
  const result = await subcategoryModel.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'subCategory',
        as: 'products',
      },
    },
    {
      $addFields: {
        productCount: {
          $size: '$products',
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        subcategoryName: 1,
        image: 1,
        status: 1,
        slug: 1,
       
        category: {
          categoryName: 1,
          slug: 1,
           _id: 1,
        },
        productCount: 1,
        categoryProductCount: 1,
      },
    },
  ]);

  return result;
};

const getAllSubCategory = async (query: Record<string, string>) => {
  // const queryBuilder = new QueryBuilder(subcategoryModel.find().populate("category","categoryName title"), query)
  const queryBuilder = new QueryBuilder(
    subcategoryModel.find().populate('category', 'categoryName slug'),
    query,
  );
  const subcategoriesData = queryBuilder
    .filter()
    .search(subcategorySearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    subcategoriesData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleSubCategory = async (id: string) => {
  const result = await subcategoryModel
    .findById(id)
    .populate('category', 'categoryName slug');
  return result;
};

const getSingleSubCategoryBySlug = async (slug: string) => {
  const result = await subcategoryModel
    .findOne({ slug })
    .populate('category', 'categoryName slug');
  return result;
};

const updateSingleSubCategory = async (
  id: string,
  updateCategory: TSubCategory,
) => {
  const result = await subcategoryModel.findByIdAndUpdate(id, updateCategory, {
    new: true,
  });
  return result;
};

const deleteSingleSubCategory = async (id: string) => {
  const result = await subcategoryModel.findByIdAndDelete(id);
  return result;
};

export const subcategoryService = {
  createSubCategor,
  getAllSubCategoryWithOutBuilder,
  getAllSubCategory,
  getSingleSubCategory,
  getSingleSubCategoryBySlug,
  updateSingleSubCategory,
  deleteSingleSubCategory,
};
