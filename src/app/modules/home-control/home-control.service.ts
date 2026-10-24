/* eslint-disable @typescript-eslint/no-unused-vars */

import type { THome } from "./home-control.interface.js";
import { homeModel } from "./home-control.model.js";






const createHome = async (homes: THome) => {
  const result = await homeModel.create(homes);
  return result;
};
const getAllHome = async () => {
  const result = await homeModel.find();
  result.sort(
  (a, b) =>
    orders.indexOf(a.order as (typeof orders)[number]) -
    orders.indexOf(b.order as (typeof orders)[number])
);
  return result;
};




const getSingleHome = async (id: string) => {
  const result = await homeModel.findById(id);
  return result;
};


const deleteSingleHome = async (id: string) => {
  const result = await homeModel.findByIdAndDelete(id);
  return result;
};

// const updateSingleHome = async (
//   id: string,
//   updateHome: THome,
// ) => {
//   const result = await homeModel.findByIdAndUpdate(id, updateHome, {
//     new: true,
//   });
//   return result;
// };


const orders = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
] as const;

const updateSingleHome = async (
  id: string,
  updateHome: Partial<THome>,
) => {
  const session = await homeModel.startSession();

  try {
    session.startTransaction();

    const current = await homeModel.findById(id).session(session);

    if (!current) {
      throw new Error("Home section not found");
    }

    if (updateHome.order && updateHome.order !== current.order) {
      const oldIndex = orders.indexOf(current.order as (typeof orders)[number]);
      const newIndex = orders.indexOf(updateHome.order as (typeof orders)[number]);

      const homes = await homeModel.find().session(session);

      // Sort by current order
      homes.sort(
        (a, b) =>
          orders.indexOf(a.order as (typeof orders)[number]) -
          orders.indexOf(b.order as (typeof orders)[number])
      );

      // Remove current item
      const filtered = homes.filter(
        (item) => item._id.toString() !== id
      );

      // Insert it at new position
      filtered.splice(newIndex, 0, current);

      // Rewrite every order
      for (let i = 0; i < filtered.length; i++) {
        const home = filtered[i];
        if (!home) continue;

        await homeModel.updateOne(
          { _id: home._id },
          {
            $set: {
              order: orders[i],
            },
          },
          { session }
        );
      }
    }

    // Update other fields
    const result = await homeModel.findByIdAndUpdate(
      id,
      {
        ...updateHome,
        order: updateHome.order ?? current.order,
      },
      {
        new: true,
        session,
      }
    );

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const homeService = {
  createHome,
  getSingleHome,
  deleteSingleHome,
  getAllHome,
  updateSingleHome
};
