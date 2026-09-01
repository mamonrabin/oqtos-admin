/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { socialIconService } from './social.service.js';

const createSocialIcon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const socialIcon = req.body;

    const result = await socialIconService.createSocialIcon(socialIcon);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'socialIcon Created Successfully',
      data: result,
    });
  },
);

const getAllSocialIcon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await socialIconService.getAllSocialIcon();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all socialIcon successfully',
      data: result,
    });
  },
);
const getActiveAllSocialIcon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await socialIconService.getActiveAllSocialIcon();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all active socialIcon successfully',
      data: result,
    });
  },
);

const updateSingleSocialIcon = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateSocialIcon = req.body;

    const result = await socialIconService.updateSingleSocialIcon(
      id as string,
      updateSocialIcon,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'socialIcon Updated Successfully',
      data: result,
    });
  },
);

const deleteSingleSocialIcon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await socialIconService.deleteSingleSocialIcon(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single socialIcon successfully',
      data: result,
    });
  },
);

export const socialIconController = {
  createSocialIcon,
  getAllSocialIcon,
  getActiveAllSocialIcon,
  updateSingleSocialIcon,
  deleteSingleSocialIcon,
};
