/* eslint-disable @typescript-eslint/no-explicit-any */
import { userModel } from "../user/user.model.js";
import AppError from "../../helpers/AppError.js";
import httpStatus from "http-status-codes";
import { createUserTokens } from "../../utils/userTokens.js";
import bcrypt from "bcryptjs";
import config from "../../config/index.js";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { IsActive } from "../user/user.interface.js";
import { sendEmail } from "../../utils/sendEmail.js";

const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User password is not set"
    );
  }

  // compare password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid password"
    );
  }

  const tokenInfo = createUserTokens(user);

  return {
    user,
    accessToken: tokenInfo.accessToken,
  };
};


const forgotPassword = async (email: string) => {
    const isUserExist = await userModel.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    // if (!isUserExist.isVerified) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    // }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, config.jwt_acess_token_secret as string, {
        expiresIn: "10m"
    })

    const resetUILink = `${config.frontend_url}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

    /**
     * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
     */
}


const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await userModel.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_round))

    user!.save();


}


// const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
//     if (payload.id != decodedToken.userId) {
//         throw new AppError(401, "You can not reset your password")
//     }


//     const isUserExist = await userModel.findById(decodedToken.userId)
//     if (!isUserExist) {
//         throw new AppError(401, "User does not exist")
//     }

//     const hashedPassword = await bcrypt.hash(
//         payload.newPassword,
//         Number(config.bcrypt_salt_round as string)
//     )

//     isUserExist.password = hashedPassword;

//     await isUserExist.save()
// }


// const resetPassword = async (
//   payload: Record<string, any>,
//   decodedToken: JwtPayload
// ) => {
//   // Check user ID
//   if (payload.id !== decodedToken.userId) {
//     throw new AppError(
//       httpStatus.UNAUTHORIZED,
//       "You cannot reset this password"
//     );
//   }

//   // Find user
//   const isUserExist = await userModel.findById(
//     decodedToken.userId
//   );

//   if (!isUserExist) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "User does not exist"
//     );
//   }

//   // Validate password
//   if (!payload.newPassword) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "New password is required"
//     );
//   }

//   if (payload.newPassword.length < 6) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Password must be at least 6 characters"
//     );
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_round)
//   );

//   isUserExist.password = hashedPassword;

//   await isUserExist.save();

//   return null;
// };


const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You cannot reset your password"
    );
  }

  const isUserExist = await userModel.findById(
    decodedToken.userId
  );

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User does not exist"
    );
  }

  if (!payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password is required"
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  isUserExist.password = hashedPassword;

  await isUserExist.save();
};

export const authServices = {
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword
};