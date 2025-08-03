import { ProductExtra, Purchase } from "@/types/purchase.type";
import { Id, StrapiResult, StrapiResultList } from "@/types/strapi.type";

/* Create Purchase  */
export type CreatePurchaseBodyParamsRequest = {
  saleId: Id;
  userId?: Id;
  purchaseItems: {
    product: string | number;
    quantity: number;
    product_option?: string | number;
    product_extra?: ProductExtra;
  }[];
} & ({ clientId: number } | { email: string });

export type CreatePurchaseResponse = StrapiResult<Purchase>;

export type CreatePurchaseNewUserBody = {
  saleId: Id;
  userId?: Id;
  purchaseItems: {
    product: Id;
    quantity: number;
    product_option?: string | number;
  }[];
};
/* Read all Purchases */
export type ReadAllPurchaseResponse = StrapiResultList<Purchase>;

/* Update Purchase */
export type UpdatePurchaseRequest = Partial<
  Pick<Purchase, "is_paid" | "purchase_status" | "id" | "is_seen_by_user"> & {
    saleId?: Id;
    clientId?: Id;
  }
>;
export type UpdatePurchaseResponse = StrapiResult<Purchase>;

export type UpdateManyPurchaseReq = (Pick<Purchase, "id"> &
  Partial<Pick<Purchase, "is_paid" | "is_seen_by_user" | "purchase_status">>)[];

export type UpdateManyPurchaseResponse = StrapiResult<Purchase>;
