/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { policyService } from './policy.service.js';
import type { TPolicyType } from './policy.interface.js';

const createPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const policy = req.body;

    const result = await policyService.createPolicy(policy);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'policy Created Successfully',
      data: result,
    });
  },
);

const getAllPolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await policyService.getAllPolicy();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all policy successfully',
      data: result,
    });
  },
);

const getAllPolicyByType = catchAsync(async (req, res) => {
  const { type } = req.query;

  const result = await policyService.getAllPolicyByType(
    type as TPolicyType | undefined,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Policies retrieved successfully",
    data: result,
  });
});

const updateSinglePolicy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const result = await policyService.updateSinglePolicy(
    req.params.id as string,
    req.body
  );

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'policy Updated Successfully',
    data: result,
  });
});



const deleteSinglePolicy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await policyService.deleteSinglePolicy(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single policy successfully',
      data: result,
    });
  },
);

export const policyController = {
  createPolicy,
  getAllPolicy,
  updateSinglePolicy,
  deleteSinglePolicy,
  getAllPolicyByType,
};
