import { Status, type TPolicy, type TPolicyType } from './policy.interface.js';
import { policyModel } from './policy.model.js';

const createPolicy = async (policy: TPolicy) => {
  const result = await policyModel.create(policy);
  return result;
};
const getAllPolicy = async () => {
  const result = await policyModel.find();
  return result;
};
// const getAllPolicyByType = async (type?: TPolicyType) => {
//   const filter = type ? { type } : {};

//   return await policyModel.find(filter);
// };

const getAllPolicyByType = async (type?: TPolicyType) => {
  const filter = {
    status: Status.Active,
    ...(type && { type }),
  };

  return await policyModel.find(filter);
};

const updateSinglePolicy = async (id: string, updatePolicy: TPolicy) => {
  const result = await policyModel.findByIdAndUpdate(id, updatePolicy, {
    new: true,
  });
  return result;
};

const deleteSinglePolicy = async (id: string) => {
  const result = await policyModel.findByIdAndDelete(id);
  return result;
};

export const policyService = {
  createPolicy,
  getAllPolicy,
  updateSinglePolicy,
  deleteSinglePolicy,
  getAllPolicyByType,
};
