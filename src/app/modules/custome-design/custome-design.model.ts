import { Schema, model } from "mongoose";

import {
  TBannerType,
  TCategorySection,
  TSectionHead,
  TCardType,
  TFlashBanner,
  TBrandSection,
  TBlogSection,
  TFooterSection,
  TShopPage,
  TSearchSection,
  TLoginSection,
  type TCustom,
  TCardCount,
  TShopCardCount,
} from "./custome-design.interface.js";

const customeSchema = new Schema<TCustom>(
  {
    home: {
      bannerType: {
        type: String,
        enum: Object.values(TBannerType),
        default: TBannerType.Default,
      },

      categorySection: {
        type: String,
        enum: Object.values(TCategorySection),
        default: TCategorySection.Default,
      },

      sectionHead: {
        type: String,
        enum: Object.values(TSectionHead),
        default: TSectionHead.Default,
      },
      flashBanner: {
        type: String,
        enum: Object.values(TFlashBanner),
        default: TFlashBanner.Default,
      },

      brandSection: {
        type: String,
        enum: Object.values(TBrandSection),
        default: TBrandSection.Default,
      },

      blogSection: {
        type: String,
        enum: Object.values(TBlogSection),
        default: TBlogSection.Default,
      },

      footerSection: {
        type: String,
        enum: Object.values(TFooterSection),
        default: TFooterSection.Default,
      },
    },

    shop: {
      shopPage: {
        type: String,
        enum: Object.values(TShopPage),
        default: TShopPage.Default,
      },

      cardType: {
        type: String,
        enum: Object.values(TCardType),
        default: TCardType.Default,
      },
      cardCount: {
        type: String,
        enum: Object.values(TCardCount),
        default: TCardCount.Default,
      },
      shopCardCount: {
        type: String,
        enum: Object.values(TShopCardCount),
        default: TShopCardCount.Default,
      },
    },

    search: {
      searchSection: {
        type: String,
        enum: Object.values(TSearchSection),
        default: TSearchSection.Default,
      },
    },

    login: {
      loginSection: {
        type: String,
        enum: Object.values(TLoginSection),
        default: TLoginSection.Default,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const customeModel = model<TCustom>(
  "custome",
  customeSchema,
);