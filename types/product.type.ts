import { StrapiImage } from "./strapi.type";

export interface Product {
  id: number;
  price: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  unit: ProductUnit;
  product_options: (string | number)[];
  image: StrapiImage;
}

export enum ProductUnit {
  KG = "kg",
  QUANTITY = "quantity",
}
