
import type { Request, Response } from "express";

import { OTPService } from "./otp.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email and name are required",
      data: null,
    });
  }

  await OTPService.sendOTP(email, name);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email and OTP are required",
      data: null,
    });
  }

  await OTPService.verifyOTP(email, otp);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully",
    data: null,
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};
