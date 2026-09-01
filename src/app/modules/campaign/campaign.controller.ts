/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { campaignService } from './campaign.service.js';


// const createCampaign = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const campaign = req.body;

//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     const result = await campaignService.createCampaign({
//       ...campaign,
//       image: imageUrl,
//     });

//     return sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: 'campaign Created Successfully',
//       data: result,
//     });
//   },
// );


const createCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const campaign = req.body;

    // Parse products array
    if (campaign.products) {
      campaign.products = JSON.parse(campaign.products);
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const result = await campaignService.createCampaign({
      ...campaign,
      image: imageUrl,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Campaign Created Successfully",
      data: result,
    });
  },
);



const getAllCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campaignService.getAllCampaign();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all campaign successfully',
      data: result,
    });
  },
);

const getFlashSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campaignService.getflashSale();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Flash sale fetched successfully',
      data: result,
    });
  },
);

const getSingleCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await campaignService.getSingleCampaign(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get single campaign successfully',
      data: result,
    });
  },
);




const updateSingleCampaign= catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateCampaign = req.body;

  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : updateCampaign.image;

  const result = await campaignService.updateSingleCampaign(id as string, {
    ...updateCampaign,
    image: imageUrl,
  });

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'campaign Updated Successfully',
    data: result,
  });
});


const deleteSingleCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await campaignService.deleteSingleCampaign(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single campaign successfully',
      data: result,
    });
  },
);

export const campaignController = {
  createCampaign,
  getAllCampaign,
  getFlashSale,
  getSingleCampaign,
  updateSingleCampaign,
  deleteSingleCampaign
};
