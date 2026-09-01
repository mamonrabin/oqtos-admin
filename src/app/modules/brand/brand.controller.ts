/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { brandService } from './brand.service.js';

const createBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brand = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const result = await brandService.createBrand({
      ...brand,
      image: imageUrl,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Brand Created Successfully',
      data: result,
    });
  },
);

const getAllBrandWithoutBuilder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await brandService.getAllBrandWithoutBuilder();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get all brand successfully',
      data: result,
    });
  },
);
const getAllBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await brandService.getAllBrand(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get all brand successfully',
      data: result,
    });
  },
);

const getAllActiveBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandService.getActiveAllBrand();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all active brand successfully',
      data: result,
    });
  },
);

const getSingleBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await brandService.getSingleBrand(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get single brand successfully',
      data: result,
    });
  },
);

const getSingleBrandBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const result = await brandService.getSingleBrandBySlug(
      slug as string,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get single brand by slug successfully',
      data: result,
    });
  },
);

const updateSingleBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateBrand = req.body;

  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : updateBrand.image;

  const result = await brandService.updateSingleBrand(id as string, {
    ...updateBrand,
    image: imageUrl,
  });

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'brand Updated Successfully',
    data: result,
  });
});


const deleteSingleBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await brandService.deleteSingleBrand(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single brand successfully',
      data: result,
    });
  },
);

export const brandController = {
  createBrand,
  getAllBrandWithoutBuilder,
  getAllBrand,
  getAllActiveBrand,
  getSingleBrand,
  getSingleBrandBySlug,
  updateSingleBrand,
  deleteSingleBrand
};
