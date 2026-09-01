/* eslint-disable @typescript-eslint/no-unused-vars */

import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { orderService } from './order.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import type { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import AppError from '../../helpers/AppError.js';

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = req.body;
    const result = await orderService.createOrder(order);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'order Created Successfully',
      data: result,
    });
  },
);

const getTodayOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await orderService.getTodayOrders(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all today order successfully',
      data: result,
    });
  },
);
const getAllOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await orderService.getAllOrder(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all order successfully',
      data: result,
    });
  },
);

const getSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await orderService.getSingleOrder(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get single order successfully',
      data: result,
    });
  },
);
const getOrderByOrderID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const result = await orderService.getOrderByOrderID(orderId as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get  order by order id successfully',
      data: result,
    });
  },
);

// get fixed latter

// const getOrderByUser = catchAsync(
//   async (req: Request, res: Response) => {
//     if (!req.user?._id) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
//     }

//     const userRef = new Types.ObjectId(req.user._id);

//     const result = await orderService.getOrdersByUser(userRef);

//     return sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Orders retrieved successfully",
//       data: result,
//     });
//   },
// );

const updateSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateOrder = req.body;
    const result = await orderService.updateSingleOrder(
      id as string,
      updateOrder,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'update single order successfully',
      data: result,
    });
  },
);

const deleteSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await orderService.deleteSingleOrder(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'deiete single order successfully',
      data: result,
    });
  },
);

export const orderController = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getOrderByOrderID,
  updateSingleOrder,
  deleteSingleOrder,
  getTodayOrders
};
