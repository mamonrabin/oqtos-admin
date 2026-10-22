import { model, Schema } from 'mongoose';
import { SliderStatus, Status, type THome } from './home-control.interface.js';

const homeSchema = new Schema<THome>(
  {
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    landing: {
      type: String,
      enum: [
        'Categories',
        'Best Selling',
        'Flash Sale',
        'Featured Products',
        'New Arrivals',
        'Top Rated',
        'Trending',
        'About',
        'Brands',
        'Testimonials',
        'Blog',
        'Newsletter',
      ],
      required: true,
    },
    order: {
      type: String,
      enum: [
        'first',
        'second',
        'third',
        'fourth',
        'fifth',
        'sixth',
        'seventh',
        'eighth',
        'ninth',
        'tenth',
        'eleventh',
        'twelfth'
      ],
      required: true,
    },

   status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
    },
   sliderStatus: {
      type: String,
      enum: Object.values(SliderStatus),
      default: SliderStatus.withslider,
    },
  },
  {
    timestamps: true,
  },
);

export const homeModel = model<THome>('home', homeSchema);
