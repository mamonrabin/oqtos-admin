import { model, Schema } from 'mongoose';
import { Status, type TThemeColors } from './theme.interface.js';

const themeSchema = new Schema<TThemeColors>(
  {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
    font: { type: String },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.InActive,
    },
  },
  {
    timestamps: true,
  },
);

export const themeModel = model<TThemeColors>('theme', themeSchema);
