import { Client } from "./client.type";
import { Product } from "./product.type";
import { Sale } from "./sale.type";

export type PurchaseStatus =
  | "purchase-pending"
  | "purchase-completed"
  | "purchase-archived";

export type Purchase = {
  id: number | string;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  client: Client;
  sale: Sale;
  purchase_items: PurchaseItem[];
  is_paid: boolean;
  total_price: number;
  is_seen_by_user: boolean;
};

export enum ProductExtra {
  CoteDeBoeuf = "Côte de boeuf",
  Fondue = "Fondue",
}
export type PurchaseItem = {
  id: number | string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  product: Product;
  product_option: string | number;
  total_price: number;
  product_extra: ProductExtra;
};
