import { Sale } from "@/types/sale.type";
import {
  StrapiAttributes,
  StrapiResultList,
  StrapiSingleResult,
} from "@/types/strapi.type";

import { UpdateSaleForm } from "@/schemas/sale-schema";

/* Read all Purchases */
export type ReadAllSaleResponse = StrapiResultList<Sale>;

/* Create Sale */
export type CreateSaleResponse = StrapiSingleResult<Sale>;

/* Update Sale */
export type UpdateSaleBody = UpdateSaleForm;
export type UpdateSaleResponse = StrapiSingleResult<Sale>;
