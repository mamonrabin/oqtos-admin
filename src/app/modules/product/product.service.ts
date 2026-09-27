import { productModel } from './product.model.js';
import {
  Status,
  type ProductLabel,
  type TProduct,
} from './product.interface.js';
import { QueryBuilder } from '../../utils/QueryBuilder.js';
import { productSearchableFields } from './product.constant.js';
import mongoose from 'mongoose';
import { categoryModel } from '../category/category.model.js';
import { subcategoryModel } from '../sub-category/sub-category.model.js';
import { brandModel } from '../brand/brand.model.js';
import { addReviewStats } from './product.utils.js';

const createProduct = async (payload: TProduct) => {
  const result = await productModel.create(payload);
  return result;
};

const getAllProductWithoutBuilder = async () => {
  const result = await productModel
    .find()
    .populate('category subCategory brand')
    .populate('category', 'categoryName')
    .populate('subCategory', 'subcategoryName')
    .populate('brand', 'title');
  // return result;
  return addReviewStats(result);
};

// const getAllProduct = async (query: Record<string, string>) => {
//   const queryBuilder = new QueryBuilder(
//     productModel
//       .find()
//       .populate('category subCategory brand')
//       .populate('category', 'categoryName')
//       .populate('subCategory', 'subcategoryName')
//       .populate('brand', 'title'),
//     query,
//   );
//   const productData = queryBuilder
//     .filter()
//     .search(productSearchableFields)
//     .sort()
//     .fields()
//     .paginate()
//     .apply();

//   const [data, meta] = await Promise.all([
//     productData.build(),
//     queryBuilder.getMeta(),
//   ]);

//   return {
//     data,
//     meta,
//   };
// };

const getAllProduct = async (query: Record<string, string>) => {
  const queryObj = { ...query };

  // ==========================================
  // CATEGORY: ID or SLUG
  // ==========================================

  if (queryObj.category) {
    if (!mongoose.Types.ObjectId.isValid(queryObj.category)) {
      const category = await categoryModel
        .findOne({
          slug: queryObj.category,
        })
        .select('_id');

      if (category) {
        queryObj.category = category._id.toString();
      }
    }
  }

  // ==========================================
  // SUB CATEGORY: ID or SLUG
  // ==========================================

  if (queryObj.subCategory) {
    if (!mongoose.Types.ObjectId.isValid(queryObj.subCategory)) {
      const subCategory = await subcategoryModel
        .findOne({
          slug: queryObj.subCategory,
        })
        .select('_id');

      if (subCategory) {
        queryObj.subCategory = subCategory._id.toString();
      }
    }
  }

  // ==========================================
  // BRAND: ID or SLUG
  // ==========================================

  if (queryObj.brand) {
    if (!mongoose.Types.ObjectId.isValid(queryObj.brand)) {
      const brand = await brandModel
        .findOne({
          slug: queryObj.brand,
        })
        .select('_id');

      if (brand) {
        queryObj.brand = brand._id.toString();
      }
    }
  }

  // ==========================================
  // QUERY BUILDER
  // ==========================================

  const queryBuilder = new QueryBuilder(
    productModel
      .find()
      .populate('category', 'categoryName')
      .populate('subCategory', 'subcategoryName')
      .populate('brand', 'title'),
    queryObj,
  );

  const productData = queryBuilder
    .filter()
    .search(productSearchableFields)
    .sort()
    .fields()
    .paginate()
    .apply();

  const [data, meta] = await Promise.all([
    productData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data: await addReviewStats(data),
    // data
    meta,
  };
};

const getRelatedProducts = async (productId: string, limit = 8) => {
  const product = await productModel.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  // Build filter for related products
  const filters: Record<string, unknown> = {
    _id: { $ne: product._id },
    $or: [
      { subCategory: product.subCategory },
      { category: product.category },
      { brand: product.brand },
    ],
  };

  const relatedProducts = await productModel
    .find(filters)
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')
    .limit(limit)
    .sort({ createdAt: -1 });

  // return relatedProducts;
  return addReviewStats(relatedProducts);
};

const getDiscountProducts = async (limit = 8) => {
  const discountProducts = await productModel
    .find({
      discount: { $gt: 0 },
      stock_status: 'in_stock',
    })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')
    .sort({ discount: -1, createdAt: -1 })
    .limit(limit);

  // return discountProducts;
  return addReviewStats(discountProducts);
};

const getProductsByCategory = async (categoryId: string) => {
  const result = await productModel
    .find({ category: categoryId })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')
    .sort({ createdAt: -1 });

  // return result;
  return addReviewStats(result);
};

const getProductsBySubCategory = async (subCategoryId: string) => {
  const result = await productModel
    .find({ subCategory: subCategoryId })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')
    .sort({ createdAt: -1 });

  return addReviewStats(result);
};

const getProductsByBrand = async (brandId: string) => {
  const result = await productModel
    .find({ brand: brandId })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')

    .sort({ createdAt: -1 });

  return addReviewStats(result);
};

const getProductsByLabels = async (label: ProductLabel, limit = 8) => {
  const result = await productModel
    .find({ label })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')
    .sort({ createdAt: -1 })
    .limit(limit);

  return addReviewStats(result);
};

const getBestSellingProducts = async (limit = 8) => {
  const result = await productModel
    .find({
      soldQuantity: { $gt: 0 },
    })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title')
    .sort({ soldQuantity: -1, createdAt: -1 })
    .limit(limit);

  return addReviewStats(result);
};

const getNewArrivalProducts = async (limit = 8) => {
  const result = await productModel
    .find({
      status: {
        $nin: [Status.InActive],
      },
    })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subcategoryName')
    .populate('brand', 'title')
    .sort({ createdAt: -1 })
    .limit(limit);

  return addReviewStats(result);
};

const getSingleProduct = async (id: string) => {
  const result = await productModel
    .findById(id)
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title');
  return result;
};

const getSingleProductBySlug = async (slug: string) => {
  const result = await productModel
    .findOne({ slug })
    .populate('category', 'categoryName')
    .populate('subCategory', 'subCategoryName')
    .populate('brand', 'title');
  return result;
};

const updateSingleProduct = async (id: string, updateProduct: TProduct) => {
  const result = await productModel.findByIdAndUpdate(id, updateProduct, {
    new: true,
  });
  return result;
};

const deleteSingleProduct = async (id: string) => {
  const result = await productModel.findByIdAndDelete(id);
  return result;
};

export const productService = {
  createProduct,
  getAllProductWithoutBuilder,
  getAllProduct,
  getRelatedProducts,
  getDiscountProducts,
  getNewArrivalProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductsByLabels,
  getBestSellingProducts,
  getSingleProduct,
  getSingleProductBySlug,
  updateSingleProduct,
  deleteSingleProduct,
};
