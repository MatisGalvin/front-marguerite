import { Product } from "./product.type";
import { Purchase } from "./purchase.type";
import { Id } from "./strapi.type";

export type Sale = {
  id: Id;
  startDate: string;
  endDate: string;
  max_weight: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  products: Product[];
  total_price: number;
  current_weight: number;
  purchases: Purchase[];
  hasSpaceForNewPurchase: boolean;
};

export type DisplaySale = Sale & {
  displayDateDay: string;
  displayDateMonth: string;
};
