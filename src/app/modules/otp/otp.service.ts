
import crypto from "crypto";
import { userModel } from "../user/user.model.js";
import AppError from "../../helpers/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { OTPModel } from "./otp.model.js";

const OTP_EXPIRATION = 120; // 2 minutes

const generateOtp = (length = 6): string => {
  return crypto
    .randomInt(10 ** (length - 1), 10 ** length)
    .toString();
};

const sendOTP = async (email: string, name: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userModel.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const otp = generateOtp();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRATION * 1000,
  );

  await OTPModel.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        otp,
        expiresAt,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Your OTP Code",
      templateName: "otp",
      templateData: { name, otp },
    });
  } catch (error) {
    await OTPModel.deleteOne({
      email: normalizedEmail,
      otp,
    });

    throw error;
  }
};

const verifyOTP = async (email: string, otp: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userModel.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const otpRecord = await OTPModel.findOne({
    email: normalizedEmail,
    otp,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    throw new AppError(401, "Invalid or expired OTP");
  }

  const result = await userModel.updateOne(
    {
      _id: user._id,
      isVerified: false,
    },
    {
      $set: { isVerified: true },
    },
    {
      runValidators: true,
    },
  );

  if (result.modifiedCount === 0) {
    throw new AppError(401, "User verification failed");
  }

  await OTPModel.deleteOne({ _id: otpRecord._id });
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
