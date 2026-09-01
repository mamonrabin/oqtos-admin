import { model, Schema } from 'mongoose';
import { AboutType, type TAbout } from './about.interface.js';


const aboutSchema = new Schema<TAbout>(
  {
    description: { type: String, required: true },
    type: {
            type: String,
            enum: Object.values(AboutType),
            default: AboutType.InActive,
          },
    video: { type: String },
   

    
  },
  {
    timestamps: true,
  },
);

export const aboutModel = model<TAbout>('about', aboutSchema);
