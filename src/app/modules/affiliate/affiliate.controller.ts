
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { affiliateService } from './affiliate.service.js';


const createAffiliate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const affiliate = req.body;

    const result = await affiliateService.createAffiliate(affiliate);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Affiliate Created Successfully",
      data: result,
    });
  }
);

const getAllAffiliate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await affiliateService.getAllAffiliate();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all affiliate successfully',
      data: result,
    });
  },
);
const getAllAciveAffiliate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await affiliateService.getAllAciveAffiliate();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all active affiliate successfully',
      data: result,
    });
  },
);



const getSingleAffiliate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await affiliateService.getSingleAffiliate(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get single affiliate  successfully',
      data: result,
    });
  },
);





const updateSingleAffiliate = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData = req.body


    const result = await affiliateService.updateSingleAffiliate(
      id as string,
      updateData
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Affiliate updated successfully",
      data: result,
    });
  }
);




const deleteSingleAffiliate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await affiliateService.deleteSingleAffiliate(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single affiliate successfully',
      data: result,
    });
  },
);

export const affiliateController = {
  createAffiliate,
  getAllAffiliate,
  getAllAciveAffiliate,
  getSingleAffiliate,
  updateSingleAffiliate,
  deleteSingleAffiliate,
};
