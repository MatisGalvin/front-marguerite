import { RequiredPostiveNumberSchema, RequiredTextSchema } from "@/lib/schema";
import { z } from "zod";

export const CreateSaleFormSchema = z.object({
  products: z
    .array(
      z.object({
        id: z.string(),
      }),
    )
    .min(1),
  name: RequiredTextSchema,
  date: z.object({
    from: z.date({
      required_error: "Date de début requise",
    }),
    to: z.date({
      required_error: "Date de fin requise",
    }),
  }),
  max_weight: RequiredPostiveNumberSchema,
});

export type CreateSaleForm = z.infer<typeof CreateSaleFormSchema>;

export const UpdateSaleFormSchema = CreateSaleFormSchema.extend({});

export type UpdateSaleForm = z.infer<typeof UpdateSaleFormSchema>;
