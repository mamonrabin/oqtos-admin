
import httpStatus from "http-status-codes";
import { Role, type IAuthProvider, type IUser } from "./user.interface.js";
import bcryptjs from "bcryptjs";
import AppError from "../../helpers/AppError.js";
import config from "../../config/index.js";
import { userModel } from "./user.model.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { userSearchableFields } from "./user.constant.js";
import { createUserTokens } from "../../utils/userTokens.js";

const createUser = async (payload:IUser) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await userModel.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(config.bcrypt_salt_round))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }


    const user = await userModel.create({
        email,
        password: hashedPassword,
        ...rest,
        auths: [authProvider],
    })

    const tokenInfo = createUserTokens(user);

     return {
    user,
    accessToken: tokenInfo.accessToken,
  };

}

const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(userModel.find({
      role: {
        $nin: [Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN],
      },
    }), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate()
         .apply();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};


const getAllAffiliedUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    userModel.find({
      role: {
        $nin: [Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN],
      },
      affiliateCoupon: {
        $exists: true,
        $nin: [null, ""],
      },
    }),
    query,
  );

  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate()
    .apply();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getAllStaffs = async () => {
  const data = await userModel
    .find({
      role: {
        $nin: [Role.USER, Role.SUPER_ADMIN],
      },
    })
    .sort({ createdAt: -1 });

  return data;
};


const getSingleUser = async (id: string) => {
    const user = await userModel.findById(id).select("-password");
    return {
        data: user
    }
};
const getMe = async (userId: string) => {
    const user = await userModel.findById(userId).select("-password");
    return {
        data: user
    }
};

const updateSingleUser= async (id: string, updateUser: IUser) => {
  const result = await userModel.findByIdAndUpdate(id, updateUser, {
    new: true,
  });
  return result;
};

const deleteSingleUser = async (id: string) => {
  const result = await userModel.findByIdAndDelete(id);
  return result;
};

export const userServices = {
    createUser,
    getAllUsers,
    getAllAffiliedUser,
    getSingleUser,
    getMe,
    deleteSingleUser,
    updateSingleUser,
    getAllStaffs
}