import { IDSchema, RequiredNumberSchema } from "@/lib/schema";
import { ProductExtra } from "@/types/purchase.type";
import { z } from "zod";

export const PurchaseItemSchema = z.object({
  product: z.union([z.string(), z.number()]).refine(
    (productId) => {
      return productId !== "";
    },
    { message: "Selectionnez un produit" },
  ),
  quantity: RequiredNumberSchema.min(1),
  product_option: z.union([z.string(), z.number()]).optional(),
  product_extra: z.nativeEnum(ProductExtra),
});

export const PurchaseSchema = z.object({
  saleId: IDSchema,
  clientId: IDSchema,
  purchaseItems: z
    .array(PurchaseItemSchema)
    .min(1, { message: "Ajoutez au moins un produit" }),
});

export type PurchaseForm = z.infer<typeof PurchaseSchema>;
