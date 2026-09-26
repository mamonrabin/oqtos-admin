/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { wishlistService } from './wishlist.service.js';

// const createWishlist = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const wishlist = req.body;

//  const { userId } = req.params;
//     const result = await wishlistService.createWishlist(userId as string, wishlist);

//     return sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: 'wishlist Created Successfully',
//       data: result,
//     });
//   },
// );


const createWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const { userRef, productRef } = req.body;

    const result = await wishlistService.createWishlist(
      userRef,
      productRef,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Wishlist created successfully",
      data: result,
    });
  },
);

const getAllWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await wishlistService.getAllWishlist();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all wishlist successfully',
      data: result,
    });
  },
);
const getWishlistByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const result = await wishlistService.getWishlistByUser(userId as string);

    if (!result) {
      throw new Error(`Wishlist not found for this user`);
    }

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all wishlist successfully',
      data: result,
    });
  },
);
const getSingleWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await wishlistService.getSingleWishlist(id as string);

    if (!result) {
      throw new Error(`Wishlist not found`);
    }

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all wishlist successfully',
      data: result,
    });
  },
);

const updateSingleWishlist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateWishlist = req.body;

  const result = await wishlistService.updateSingleWishlist(
    id as string,
    updateWishlist,
  );

  if (!result) {
    throw new Error(`Wishlist not found`);
  }

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'wishlist Updated Successfully',
    data: result,
  });
});

const deleteSingleWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await wishlistService.deleteSingleWishlist(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single wishlist successfully',
      data: result,
    });
  },
);

export const wishlistController = {
  createWishlist,
  getAllWishlist,
  getWishlistByUser,
  getSingleWishlist,
  updateSingleWishlist,
  deleteSingleWishlist,
};
