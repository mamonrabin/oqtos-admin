/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { reviewService } from './review.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {


    const files = req.files as any;

  

    const data = req.body;

    const images = files?.images?.map((f: any) => `/uploads/${f.filename}`) || [];

    const result = await reviewService.createReview({ ...data, images });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Review Created Successfully',
      data: result,
    });
  },
);

const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getReview();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get Reviews Successfully',
      data: result,
    });
  },
);

const getAllReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await reviewService.getAllReview(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get All Review Successfully',
      data: result,
    });
  },
);

const getSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await reviewService.getSingleReview(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get Single Reviews Successfully',
      data: result,
    });
  },
);

const deleteSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await reviewService.deleteSingleReview(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'delete sinngle review successfully',
      data: result,
    });
  },
);

const updateSingleReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const result = await reviewService.updateSingleReview(
    req.params.id as string,
    req.body
  );

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review Updated Successfully',
    data: result,
  });
});


export const reviewController = {
  createReview,
  getReview,
  getAllReview,
  getSingleReview,
  deleteSingleReview,
  updateSingleReview
};
