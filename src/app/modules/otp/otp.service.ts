
import crypto from "crypto";
import { userModel } from "../user/user.model.js";
import AppError from "../../helpers/AppError.js";
import { redisClient } from "../../config/redis.config.js";
import { sendEmail } from "../../utils/sendEmail.js";

const OTP_EXPIRATION = 120; // 2 minutes

const generateOtp = (length = 6): string => {
  return crypto
    .randomInt(10 ** (length - 1), 10 ** length)
    .toString();
};

const sendOTP = async (email: string, name: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    EX: OTP_EXPIRATION,
  });

  try {
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      templateName: "otp",
      templateData: { name, otp },
    });
  } catch (error) {
    await redisClient.del(redisKey);
    throw error;
  }
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp || savedOtp !== otp) {
    throw new AppError(401, "Invalid or expired OTP");
  }

  // Delete the OTP only after successful verification.
  await userModel.updateOne(
    { _id: user._id, isVerified: false },
    { $set: { isVerified: true } },
    { runValidators: true },
  );

  await redisClient.del(redisKey);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
