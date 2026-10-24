import { Types } from "mongoose";

export type TCity =
  | "Bagerhat"
  | "Bandarban"
  | "Barguna"
  | "Barisal"
  | "Bhola"
  | "Bogra"
  | "Brahmanbaria"
  | "Chandpur"
  | "Chapai Nawabganj"
  | "Chattogram"
  | "Chuadanga"
  | "Comilla"
  | "Cox's Bazar"
  | "Dhaka"
  | "Dinajpur"
  | "Faridpur"
  | "Feni"
  | "Gaibandha"
  | "Gazipur"
  | "Gopalganj"
  | "Habiganj"
  | "Jamalpur"
  | "Jashore"
  | "Jhalokati"
  | "Jhenaidah"
  | "Joypurhat"
  | "Khagrachhari"
  | "Khulna"
  | "Kishoreganj"
  | "Kurigram"
  | "Kushtia"
  | "Lakshmipur"
  | "Lalmonirhat"
  | "Madaripur"
  | "Magura"
  | "Manikganj"
  | "Meherpur"
  | "Moulvibazar"
  | "Munshiganj"
  | "Mymensingh"
  | "Naogaon"
  | "Narail"
  | "Narayanganj"
  | "Narsingdi"
  | "Natore"
  | "Netrokona"
  | "Nilphamari"
  | "Noakhali"
  | "Pabna"
  | "Panchagarh"
  | "Patuakhali"
  | "Pirojpur"
  | "Rajbari"
  | "Rajshahi"
  | "Rangamati"
  | "Rangpur"
  | "Satkhira"
  | "Shariatpur"
  | "Sherpur"
  | "Sirajganj"
  | "Sunamganj"
  | "Sylhet"
  | "Tangail"
  | "Thakurgaon";

export type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "ON_HOLD"
  | "IN_REVIEW"
  | "RETURNED";

export type TPaymentMethod = "COD" | "CARD" | "BKASH" | "NAGAD";

export type TPaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type TCourierProvider =
  | "NONE"
  | "STEADFAST"
  | "PATHAO"
  | "REDX";

export type TCourierStatus =
  | "PENDING"
  | "PICKUP_REQUESTED"
  | "PICKED_UP"
  | "IN_HUB"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

export type TOrderProduct = {
  productRef: Types.ObjectId;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
};

export type TShippingAddress = {
  thana: string;
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  city: TCity;
  address: string;
};

export type TCourier = {
  provider: TCourierProvider;
  consignmentId?: string;
  trackingCode?: string;
  status?: TCourierStatus;
  createdAt?: Date;
  updatedAt?: Date;
  response?: Record<string, unknown>;
};



export type TOrder = {
  orderId: string;
  userRef: Types.ObjectId;
  payment?: Types.ObjectId;
  products: TOrderProduct[];
  shippingAddress: TShippingAddress;
  subTotalPrice: number;
  shippingCost: number;
  discount?: number;
  totalPrice: number;
  couponRef?: Types.ObjectId;
  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;
  status: TOrderStatus;
  note?: string;
  courier?: TCourier;


};