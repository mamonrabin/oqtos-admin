/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { productService } from './product.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import type { ProductLabel } from './product.interface.js';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as any;

  const productData = req.body;

  const thumbnail = files?.thumbnailImage?.[0]?.filename;
  const backview = files?.backviewImage?.[0]?.filename;

  const images = files?.images?.map((f: any) => `/uploads/${f.filename}`) || [];

  if (req.body.inventories) {
    productData.inventories = JSON.parse(req.body.inventories);
  }

  if (productData.specifications) {
    productData.specifications = JSON.parse(productData.specifications);
  }

  // Convert boolean
  if (productData.freeShipping !== undefined) {
    productData.freeShipping = productData.freeShipping === 'true';
  }

  if (productData.tags) {
  productData.tags = JSON.parse(productData.tags);
}

  const result = await productService.createProduct({
    ...productData,
    thumbnailImage: thumbnail ? `/uploads/${thumbnail}` : '',
    backviewImage: backview ? `/uploads/${backview}` : '',
    images,
  });

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data: result,
  });
});


const getAllProductWithoutBuilder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.getAllProductWithoutBuilder();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all products successfully',
      data: result,
    });
  },
);

const getAllProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await productService.getAllProduct(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all product successfully',
      data: result,
    });
  },
);

const getReletiveProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const result = await productService.getRelatedProducts(id as string, limit);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all product successfully',
      data: result,
    });
  },
);
const getDiscountProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const result = await productService.getDiscountProducts(limit);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get discount products successfully',
      data: result,
    });
  },
);
const getNewArrivalProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const result = await productService.getNewArrivalProducts(limit);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get new arrival products successfully',
      data: result,
    });
  },
);

const getProductsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await productService.getProductsByCategory(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get products by category successfully',
      data: result,
    });
  },
);

const getProductsBySubCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await productService.getProductsBySubCategory(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get products by sub-category successfully',
      data: result,
    });
  },
);

const getProductsByBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await productService.getProductsByBrand(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get products by brand successfully',
      data: result,
    });
  },
);

const getProductsByLabels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { label } = req.params;
    const result = await productService.getProductsByLabels(
      label as ProductLabel,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get products by labels successfully',
      data: result,
    });
  },
);

const getBestSellingProducts = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const result = await productService.getBestSellingProducts(limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best selling products retrieved successfully',
    data: result,
  });
});
const getTopProducts = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const result = await productService.getTopProducts(limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top products retrieved successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await productService.getSingleProduct(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get single product successfully',
      data: result,
    });
  },
);

const getSingleProductBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const result = await productService.getSingleProductBySlug(slug as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get single product by slug successfully',
      data: result,
    });
  },
);

const updateSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Handle updated images if any are uploaded
    const thumbnailImage = files?.backviewImage?.[0]?.filename;
    const backviewImage = files?.backviewImage?.[0]?.filename;
    const images =
      files?.images?.map((file) => `/uploads/${file.filename}`) || [];

    const updatedProduct = {
      ...updateData,
      ...(thumbnailImage && { backviewImage: `/uploads/${thumbnailImage}` }),
      ...(backviewImage && { backviewImage: `/uploads/${backviewImage}` }),
      ...(images.length > 0 && { images }),
    };

    const result = await productService.updateSingleProduct(
      id as string,
      updatedProduct,
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteSingleProduct(id as string);
    res.status(200).json({
      success: true,
      message: 'delete sinngle product successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
  getAllProductWithoutBuilder,
  getAllProduct,
  getReletiveProduct,
  getDiscountProducts,
  getNewArrivalProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductsByLabels,
  getBestSellingProducts,
  getTopProducts,
  getSingleProduct,
  getSingleProductBySlug,
  updateSingleProduct,
  deleteSingleProduct,
};
