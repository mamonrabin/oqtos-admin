import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { brandSearchableFields } from "./brand.constant.js";
import { Status, type TBrand } from "./brand.interface.js";
import { brandModel } from "./brand.model.js";



const createBrand = async (brand: TBrand) => {
  const result = await brandModel.create(brand);
  return result;
};
const getAllBrandWithoutBuilder = async () => {
  const result = await brandModel.find();
  return result;
};

const getAllBrand = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(brandModel.find(), query)
    const brandData = queryBuilder
        .filter()
        .search(brandSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        brandData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};

const getActiveAllBrand = async () => {
  const result = await brandModel.find({
    status: {
        $nin: [Status.InActive],
      },
  });
  return result;
};

const getSingleBrand = async (id: string) => {
  const result = await brandModel.findById(id);
  return result;
};

const getSingleBrandBySlug = async (slug: string) => {
  const result = await brandModel.findOne({ slug });
  return result;
};

const updateSingleBrand = async (
  id: string,
  updateBrand: TBrand,
) => {
  const result = await brandModel.findByIdAndUpdate(id, updateBrand, {
    new: true,
  });
  return result;
};

const deleteSingleBrand = async (id: string) => {
  const result = await brandModel.findByIdAndDelete(id);
  return result;
};

export const brandService = {
  createBrand,
  getAllBrandWithoutBuilder,
  getAllBrand,
  getActiveAllBrand,
  getSingleBrand,
  getSingleBrandBySlug,
  updateSingleBrand,
  deleteSingleBrand,
};
