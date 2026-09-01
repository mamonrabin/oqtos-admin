/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { authServices } from './auth.service.js';
import { setAuthCookie } from '../../utils/setCookie.js';
import type { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/sendResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import type { JwtPayload } from 'jsonwebtoken';
import AppError from '../../helpers/AppError.js';
import { createUserTokens } from '../../utils/userTokens.js';
import config from '../../config/index.js';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = req.body;

    const result = await authServices.loginUser(loginInfo);

    setAuthCookie(res, {
      accessToken: result.accessToken,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Login successful',
      data: result,
    });
  },
);

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { email } = req.body;

    await authServices.forgotPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})



const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await authServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})


// const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const decodedToken = req.user

//     await authServices.resetPassword(req.body, decodedToken as JwtPayload);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Password Changed Successfully",
//         data: null,
//     })
// })


const resetPassword = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized"
      );
    }

    await authServices.resetPassword(
      req.body,
      req.user as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully",
      data: null,
    });
  }
);






const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user= req.user;

    // console.log("............user..........",user)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user as any)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${config.frontend_url}/${redirectTo}`)
})


export const authControllers = {
  credentialsLogin,
  logout,
  resetPassword,
  forgotPassword,
  changePassword,
  googleCallbackController
};
