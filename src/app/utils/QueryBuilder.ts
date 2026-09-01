/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, { Query } from "mongoose";
import { excludeField } from "../constants.js";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;

  private filterQuery: Record<string, any> = {};

  constructor(
    modelQuery: Query<T[], T>,
    query: Record<string, string>
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // =====================================================
  // FILTER
  // =====================================================

  filter(): this {
    const filter = { ...this.query };

    // Remove pagination / sorting / search fields
    excludeField.forEach((field) => {
      delete filter[field];
    });

    // Remove empty values
    Object.keys(filter).forEach((key) => {
      if (
        filter[key] === "" ||
        filter[key] === undefined ||
        filter[key] === null
      ) {
        delete filter[key];
      }
    });

    const itemFilter: Record<string, any> = {};

    // =====================================================
    // CATEGORY
    // =====================================================

    if (filter.category) {
      if (mongoose.Types.ObjectId.isValid(filter.category)) {
        itemFilter.category = new mongoose.Types.ObjectId(
          filter.category
        );
      }

      delete filter.category;
    }

    // =====================================================
    // SUB CATEGORY
    // =====================================================

    if (filter.subCategory) {
      if (mongoose.Types.ObjectId.isValid(filter.subCategory)) {
        itemFilter.subCategory = new mongoose.Types.ObjectId(
          filter.subCategory
        );
      }

      delete filter.subCategory;
    }

    // =====================================================
    // BRAND
    // =====================================================

    if (filter.brand) {
      if (mongoose.Types.ObjectId.isValid(filter.brand)) {
        itemFilter.brand = new mongoose.Types.ObjectId(
          filter.brand
        );
      }

      delete filter.brand;
    }

    // =====================================================
    // COLOR
    // inventories.color
    //
    // Example:
    // ?color=Red,Blue,Black
    // =====================================================

    if (filter.color) {
      const colors = filter.color
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean);

      if (colors.length > 0) {
        itemFilter["inventories.color"] = {
          $in: colors,
        };
      }

      delete filter.color;
    }

    // =====================================================
    // SIZE
    // inventories.size
    //
    // Example:
    // ?size=M,L,XL
    // =====================================================

    if (filter.size) {
      const sizes = filter.size
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      if (sizes.length > 0) {
        itemFilter["inventories.size"] = {
          $in: sizes,
        };
      }

      delete filter.size;
    }

    // =====================================================
    // STOCK STATUS
    // =====================================================

    if (filter.stock_status) {
      itemFilter.stock_status = filter.stock_status;
      delete filter.stock_status;
    }

    // =====================================================
    // LABEL
    // =====================================================

    if (filter.label) {
      itemFilter.label = filter.label;
      delete filter.label;
    }

    // =====================================================
    // LABELS
    // =====================================================

    if (filter.labels) {
      const labels = filter.labels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean);

      itemFilter.labels = {
        $in: labels,
      };

      delete filter.labels;
    }

    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    if (filter.paymentMethod) {
      itemFilter.paymentMethod = filter.paymentMethod;
      delete filter.paymentMethod;
    }

    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    if (filter.paymentStatus) {
      itemFilter.paymentStatus = filter.paymentStatus;
      delete filter.paymentStatus;
    }

    // =====================================================
    // ORDER STATUS
    // =====================================================

    if (filter.status) {
      itemFilter.status = filter.status;
      delete filter.status;
    }

    // =====================================================
    // PRICE RANGE
    //
    // ?minPrice=500&maxPrice=2000
    // =====================================================

    if (
      filter.minPrice !== undefined ||
      filter.maxPrice !== undefined
    ) {
      const priceFilter: Record<string, number> = {};

      if (
        filter.minPrice !== undefined &&
        filter.minPrice !== ""
      ) {
        const minPrice = Number(filter.minPrice);

        if (!Number.isNaN(minPrice)) {
          priceFilter.$gte = minPrice;
        }
      }

      if (
        filter.maxPrice !== undefined &&
        filter.maxPrice !== ""
      ) {
        const maxPrice = Number(filter.maxPrice);

        if (!Number.isNaN(maxPrice)) {
          priceFilter.$lte = maxPrice;
        }
      }

      if (Object.keys(priceFilter).length > 0) {
        itemFilter.price = priceFilter;
      }

      delete filter.minPrice;
      delete filter.maxPrice;
    }

    // =====================================================
    // DATE FILTER
    // =====================================================

    if (filter.dateFilter) {
      const now = new Date();

      let startDate: Date | null = null;
      let endDate: Date | null = null;

      switch (filter.dateFilter) {
        case "today": {
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);

          break;
        }

        case "yesterday": {
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);

          break;
        }

        case "this-week": {
          startDate = new Date(now);

          const day = startDate.getDay();
          const diff = day === 0 ? -6 : 1 - day;

          startDate.setDate(
            startDate.getDate() + diff
          );

          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);

          break;
        }

        case "this-month": {
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );

          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);

          break;
        }

        case "this-year": {
          startDate = new Date(
            now.getFullYear(),
            0,
            1
          );

          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);

          break;
        }
      }

      if (startDate && endDate) {
        itemFilter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      delete filter.dateFilter;
    }

    // =====================================================
    // FINAL FILTER
    // =====================================================

    this.filterQuery = {
      ...itemFilter,
      ...filter,
    };

    return this;
  }

  // =====================================================
  // SEARCH
  // =====================================================

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm?.trim();

    if (!searchTerm) {
      return this;
    }

    this.filterQuery.$or = searchableFields.map(
      (field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })
    );

    return this;
  }

  // =====================================================
  // SORT
  // =====================================================

  sort(): this {
    const sortBy = this.query.sort;

    let sortField = "createdAt";
    let sortOrder: 1 | -1 = -1;

    switch (sortBy) {
      case "a-z":
        sortField = "title";
        sortOrder = 1;
        break;

      case "z-a":
        sortField = "title";
        sortOrder = -1;
        break;

      case "priceLowToHigh":
        sortField = "price";
        sortOrder = 1;
        break;

      case "priceHighToLow":
        sortField = "price";
        sortOrder = -1;
        break;

      case "dateOldToNew":
        sortField = "createdAt";
        sortOrder = 1;
        break;

      case "dateNewToOld":
      default:
        sortField = "createdAt";
        sortOrder = -1;
        break;
    }

    this.modelQuery = this.modelQuery.sort({
      [sortField]: sortOrder,
    });

    return this;
  }

  // =====================================================
  // FIELDS
  // =====================================================

  fields(): this {
    const fields =
      this.query.fields
        ?.split(",")
        .join(" ") || "";

    if (fields) {
      this.modelQuery =
        this.modelQuery.select(fields);
    }

    return this;
  }

  // =====================================================
  // PAGINATION
  // =====================================================

  paginate(): this {
    const page =
      Number(this.query.page) || 1;

    const limit =
      Number(this.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    this.modelQuery =
      this.modelQuery
        .skip(skip)
        .limit(limit);

    return this;
  }

  // =====================================================
  // APPLY
  // =====================================================

  apply(): this {
    this.modelQuery =
      this.modelQuery.find(this.filterQuery);

    return this;
  }

  // =====================================================
  // BUILD
  // =====================================================

  build() {
    return this.modelQuery;
  }

  // =====================================================
  // META
  // =====================================================

  async getMeta() {
    const totalDocuments =
      await this.modelQuery.model.countDocuments(
        this.filterQuery
      );

    const page =
      Number(this.query.page) || 1;

    const limit =
      Number(this.query.limit) || 10;

    return {
      page,
      limit,
      total: totalDocuments,
      totalPage: Math.ceil(
        totalDocuments / limit
      ),
    };
  }
}