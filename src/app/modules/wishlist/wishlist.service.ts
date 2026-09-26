/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TWishlist } from './wishlist.interface.js';
import { wishlistModel } from './wishlist.model.js';

// const createWishlist = async (wishlist: TWishlist) => {
//   const result = await wishlistModel.create(wishlist);
//   return result;
// };

const createWishlist = async (userRef: string, productRef: string) => {
  const result = await wishlistModel.findOneAndUpdate(
    { userRef } as any,
    {
      $addToSet: {
        productRef,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return result;
};

const getAllWishlist = async () => {
  const result = await wishlistModel.find();
  return result;
};

const getWishlistByUser = async (userId: string) => {
  const result = await wishlistModel
    .findOne({ userRef: userId } as any)
    .populate('productRef');
  return result;
};

const getSingleWishlist = async (id: string) => {
  const result = await wishlistModel
    .findById(id)
    .populate('productRef userRef');
  return result;
};

const updateSingleWishlist = async (id: string, updateWishlist: TWishlist) => {
  const result = await wishlistModel.findByIdAndUpdate(id, updateWishlist, {
    new: true,
  });
  return result;
};



const deleteSingleWishlist = async (id: string) => {
  const result = await wishlistModel.findOneAndUpdate(
    {
      productRef: id,
    } as any,
    {
      $pull: {
        productRef: id,
      },
    },
    {
      new: true,
    }
  );

  return result;
};

export const wishlistService = {
  createWishlist,
  getAllWishlist,
  getWishlistByUser,
  getSingleWishlist,
  updateSingleWishlist,
  deleteSingleWishlist,
};
