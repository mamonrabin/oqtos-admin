/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { blogService } from './blog.service.js';

const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

     const blog = {
      ...req.body,
      tags: req.body.tags
        ? JSON.parse(req.body.tags)
        : [],
    };

    const imageUrl = files?.image?.[0]
      ? `/uploads/${files.image[0].filename}`
      : "";

    const images =
      files?.images?.map(
        (file) => `/uploads/${file.filename}`
      ) || [];

    const result = await blogService.createBlog({
      ...blog,
      image: imageUrl,
      images,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Blog Created Successfully",
      data: result,
    });
  }
);

const getAllBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.getAllBlog();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all blog successfully',
      data: result,
    });
  },
);

const getAllBlogByStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.getAllBlogByStatus();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' get all published blog successfully',
      data: result,
    });
  },
);

const getSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await blogService.getSingleBlog(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get single blog  successfully',
      data: result,
    });
  },
);
const getSingleBlogBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const result = await blogService.getSingleBlogBySlug(slug as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'get single blog by slug successfully',
      data: result,
    });
  },
);




const updateSingleBlog = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    const files = (req.files || {}) as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Update main image only if a new image is uploaded
    if (files?.image?.[0]) {
      updateData.image = `/uploads/${files.image[0].filename}`;
    }

    // Update additional images only if new images are uploaded
    if (files?.images?.length) {
      updateData.images = files.images.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const result = await blogService.updateSingleBlog(
      id as string,
      updateData
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blog updated successfully",
      data: result,
    });
  }
);


const updateBlogStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await blogService.updateBlogStatus(
      id as string,
      status
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blog status updated successfully",
      data: result,
    });
  }
);


const deleteSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await blogService.deleteSingleBlog(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: ' delete single blog successfully',
      data: result,
    });
  },
);

export const blogController = {
  createBlog,
  getAllBlog,
  getAllBlogByStatus,
  getSingleBlog,
  getSingleBlogBySlug,
  updateSingleBlog,
  updateBlogStatus,
  deleteSingleBlog,
};
