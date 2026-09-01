/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { aboutService } from './about.service.js';

const createAbout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const about = req.body;

    const result = await aboutService.createAbout(about);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'about Created Successfully',
      data: result,
    });
  },
);

const getAllAbout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await aboutService.getAllAbout();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all about successfully',
      data: result,
    });
  },
);
const getAllActiveAbout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await aboutService.getAllActiveAbout();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all active about successfully',
      data: result,
    });
  },
);

const updateSingleAbout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateAbout = req.body;

  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : updateAbout.image;

  const result = await aboutService.updateSingleAbout(id as string, {
    ...updateAbout,
    image: imageUrl,
  });

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'about Updated Successfully',
    data: result,
  });
});

const deleteSingleAbout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await aboutService.deleteSingleAbout(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single about successfully',
      data: result,
    });
  },
);

export const aboutController = {
  createAbout,
  getAllAbout,
  getAllActiveAbout,
  updateSingleAbout,
  deleteSingleAbout,
};
