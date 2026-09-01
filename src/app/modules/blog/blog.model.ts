import { Schema, model, type HydratedDocument } from 'mongoose';
import { Status, type TBlog } from './blog.interface.js';
import { generateSlug } from '../../utils/slug.js';

const blogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    cardDescription: {
      type: String,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

     images: { type: [String], default: [] },

    tags: [
      {
        type: String,
      },
    ],

     status: {
          type: String,
          enum: Object.values(Status),
          default: Status.draft,
        },
  },
  {
    timestamps: true,
  },
);

blogSchema.pre('save', async function () {
  const blog = this as HydratedDocument<TBlog>;

  if (
    (blog.isModified('title') || blog.isNew) &&
    blog.title
  ) {
    blog.slug = generateSlug(blog.title);
  }
});

export const blogModel = model<TBlog>('blog', blogSchema);
