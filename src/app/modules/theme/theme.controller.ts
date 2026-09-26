/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { Status } from "./theme.interface.js";
import { themeService } from "./theme.service.js";
import httpStatus from 'http-status-codes';
const createTheme = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const theme = req.body;

    const result = await themeService.createTheme(theme);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Theme created successfully",
      data: result,
    });
  },
);

const getAllTheme = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await themeService.getAllTheme();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Themes retrieved successfully",
      data: result,
    });
  },
);

const getThemeByStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.params;

    const result = await themeService.getThemeByStatus(
      status as Status,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Theme retrieved successfully",
      data: result,
    });
  },
);

const updateSingleTheme = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const theme = req.body;

    const result = await themeService.updateSingleTheme(
      id as string,
      theme,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Theme updated successfully",
      data: result,
    });
  },
);

const deleteSingleTheme = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await themeService.deleteSingleTheme(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Theme deleted successfully",
      data: result,
    });
  },
);

export const themeController = {
  createTheme,
  getAllTheme,
  getThemeByStatus,
  updateSingleTheme,
  deleteSingleTheme,
};