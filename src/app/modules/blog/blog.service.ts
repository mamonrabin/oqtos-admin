import { Status, type TBlog } from './blog.interface.js';
import { blogModel } from './blog.model.js';

const createBlog = async (blog: TBlog) => {
  const result = await blogModel.create(blog);
  return result;
};
const getAllBlog = async () => {
  const result = await blogModel.find();
  return result;
};
const getAllBlogByStatus = async () => {
  const result = await blogModel.find({
    status: {
      $nin: [Status.draft],
    },
  });
  return result;
};

const getSingleBlog = async (id: string) => {
  const result = await blogModel.findById(id);
  return result;
};
const getSingleBlogBySlug = async (slug: string) => {
  const result = await blogModel.findOne({ slug });
  return result;
};

const updateSingleBlog = async (id: string, updateData: Partial<TBlog>) => {
  const result = await blogModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const updateBlogStatus = async (id: string, status: 'draft' | 'published') => {
  const result = await blogModel.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteSingleBlog = async (id: string) => {
  const result = await blogModel.findByIdAndDelete(id);
  return result;
};

export const blogService = {
  createBlog,
  getAllBlog,
  getAllBlogByStatus,
  getSingleBlog,
  getSingleBlogBySlug,
  updateSingleBlog,
  updateBlogStatus,
  deleteSingleBlog,
};
