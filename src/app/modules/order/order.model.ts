import { model, Schema } from 'mongoose';
import type { TOrder } from './order.interface.js';
import orderIdGenerate from '../../utils/orderIdGenerate.js';

const orderSchema = new Schema<TOrder>(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },

    userRef: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      index: true,
      required:true
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'payment',
      index: true,
    },

    products: [
      {
        productRef: {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        color: { type: String },
        size: { type: String },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String },
      email: { type: String },
      city: {
        type: String,
        required: true,
        enum: [
          'Bagerhat',
          'Bandarban',
          'Barguna',
          'Barisal',
          'Bhola',
          'Bogra',
          'Brahmanbaria',
          'Chandpur',
          'Chapai Nawabganj',
          'Chattogram',
          'Chuadanga',
          'Comilla',
          "Cox's Bazar",
          'Dhaka',
          'Dinajpur',
          'Faridpur',
          'Feni',
          'Gaibandha',
          'Gazipur',
          'Gopalganj',
          'Habiganj',
          'Jamalpur',
          'Jashore',
          'Jhalokati',
          'Jhenaidah',
          'Joypurhat',
          'Khagrachhari',
          'Khulna',
          'Kishoreganj',
          'Kurigram',
          'Kushtia',
          'Lakshmipur',
          'Lalmonirhat',
          'Madaripur',
          'Magura',
          'Manikganj',
          'Meherpur',
          'Moulvibazar',
          'Munshiganj',
          'Mymensingh',
          'Naogaon',
          'Narail',
          'Narayanganj',
          'Narsingdi',
          'Natore',
          'Netrokona',
          'Nilphamari',
          'Noakhali',
          'Pabna',
          'Panchagarh',
          'Patuakhali',
          'Pirojpur',
          'Rajbari',
          'Rajshahi',
          'Rangamati',
          'Rangpur',
          'Satkhira',
          'Shariatpur',
          'Sherpur',
          'Sirajganj',
          'Sunamganj',
          'Sylhet',
          'Tangail',
          'Thakurgaon',
        ],
      },
      address: { type: String, required: true },
    },

    subTotalPrice: {
      type: Number,
      required: true,
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    couponRef: {
      type: Schema.Types.ObjectId,
      ref: 'coupon',
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD', 'BKASH', 'NAGAD'],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'UNPAID',
    },

    status: {
      type: String,
      enum: [
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'ON_HOLD',
        'IN_REVIEW',
        'RETURNED',
      ],
      default: 'PENDING',
    },

    courier: {
      provider: {
        type: String,
        enum: ['NONE', 'STEADFAST', 'PATHAO', 'REDX'],
        default: 'NONE',
      },
      consignmentId: {
        type: String,
        default: '',
      },
      trackingCode: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        enum: [
          'PENDING',
          'PICKUP_REQUESTED',
          'PICKED_UP',
          'IN_HUB',
          'IN_TRANSIT',
          'OUT_FOR_DELIVERY',
          'DELIVERED',
          'RETURNED',
          'CANCELLED',
        ],
        default: 'PENDING',
      },
      createdAt: Date,
      updatedAt: Date,
      response: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },

    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre('save', function () {
  if (!this.orderId) {
    this.orderId = orderIdGenerate('ORD-');
  }
});

orderSchema.index({ userRef: 1, createdAt: -1 });
// orderSchema.index({ payment: 1 });
// orderSchema.index({ orderId: 1 });

export const orderModel = model<TOrder>('order', orderSchema);
