/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { userServices } from './user.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AppError from '../../helpers/AppError.js';
import type { JwtPayload } from 'jsonwebtoken';
import { setAuthCookie } from '../../utils/setCookie.js';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);


     setAuthCookie(res, {
          accessToken: user.accessToken,
        });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User Created Successfully',
      data: user,
    });
  },
);



const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await userServices.getAllUsers(
      query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All Users Retrieved Successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);
const getAllAffiliedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await userServices.getAllAffiliedUser(
      query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All Affilited Users Retrieved Successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);


const getAllStaffs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllStaffs();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Staffs Retrieved Successfully",
      data: result,
    });
  }
);

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;

  if (!decodedToken) {
    throw new AppError(401, 'Unauthorized');
  }

  const result = await userServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Your profile Retrieved Successfully',
    data: result.data,
  });
});


const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userServices.getSingleUser(id as string);
   
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User Retrieved Successfully',
      data: result.data,
    });
  },
);

const deleteSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userServices.deleteSingleUser(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User Deleted Successfully',
      data: result,
    });
  },
);

// const updateSingleUser = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const updateUser = req.body;
//     const result = await userServices.updateSingleUser(
//       id as string,
//       updateUser,
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'User Updated Successfully',
//       data: result,
//     });
//   },
// );

const updateSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log("BODY:", req.body);

  const result = await userServices.updateSingleUser(
    req.params.id as string,
    req.body
  );

  console.log("RESULT:", result);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Updated Successfully",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getAllUsers,
  getAllAffiliedUser,
  getSingleUser,
  getMe,
  deleteSingleUser,
  updateSingleUser,
  getAllStaffs
};
