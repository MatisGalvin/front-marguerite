import { Product } from "@/types/product.type";
import { StrapiResult, StrapiResultList } from "@/types/strapi.type";

/* Create Product  */
export type CreateProductBodyParamsRequest = Pick<
  Product,
  "name" | "description" | "price" | "unit"
> & {
  image: File;
};

export type CreateProductResponse = StrapiResult<Product>;

/* Read all Products */
export type ReadAllProductResponse = StrapiResultList<Product>;
export type ReadAllProductRequest = { userId?: string }


/* Update Product */
export type UpdateProductRequest = Pick<Product, "id">;
export type UpdateProductResponse = StrapiResult<Product>;
