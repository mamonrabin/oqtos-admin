/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { customeService } from "./custome-design.service.js";

const createCustome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customData = req.body;

    const result = await customeService.createCustome(customData);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Custom design created successfully",
      data: result,
    });
  },
);

const getAllCustome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await customeService.getAllCustome();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all custom designs successfully",
      data: result,
    });
  },
);

const getSingleCustome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await customeService.getSingleCustome(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get single custom design successfully",
      data: result,
    });
  },
);

const updateSingleCustome = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await customeService.updateSingleCustome(
      id as string,
      updateData,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Custom design updated successfully",
      data: result,
    });
  },
);

const deleteSingleCustome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await customeService.deleteSingleCustome(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delete single custom design successfully",
      data: result,
    });
  },
);

export const customeController = {
  createCustome,
  getAllCustome,
  getSingleCustome,
  updateSingleCustome,
  deleteSingleCustome,
};