/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { bannerService } from './banner.service.js';

const createBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const banner = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const result = await bannerService.createBanner({
      ...banner,
      image: imageUrl,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'banner Created Successfully',
      data: result,
    });
  },
);

const getAllBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bannerService.getAllBanner();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all banner successfully',
      data: result,
    });
  },
);
const getAllActiveBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bannerService.getActiveAllBanner();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all active banner successfully',
      data: result,
    });
  },
);





const updateSingleBanner= catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateBanner = req.body;

  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : updateBanner.image;

  const result = await bannerService.updateSingleBanner(id as string, {
    ...updateBanner,
    image: imageUrl,
  });

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'banner Updated Successfully',
    data: result,
  });
});


const deleteSingleBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await bannerService.deleteSingleBanner(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single banner successfully',
      data: result,
    });
  },
);

export const bannerController = {
  createBanner,
  getAllBanner,
  getAllActiveBanner,
  updateSingleBanner,
  deleteSingleBanner
};
