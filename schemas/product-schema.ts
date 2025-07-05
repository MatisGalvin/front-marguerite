import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(2, {
    message: "Requis",
  }),

  description: z.string().min(2, {
    message: "Requis",
  }),
  price: z.number().min(0, {
    message: "Requis",
  }),
  unit: z.enum(["kg", "quantity"]),
  product_options: z
    .string()
    .optional()
    .refine(
      (product_options) => {
        if (product_options) {
          const optionsSchema = z.string().array();
          return optionsSchema.safeParse(product_options.split(",")).success;
        } else {
          return true;
        }
      },
      { message: "Les valeurs doivent être séparés par des virgules" },
    ),
  image: z
    .custom<File>()
    .refine(
      (file) => {
        return file?.size !== undefined;
      },
      {
        message: "Requis",
      },
    )
    .refine(
      (file) => {
        return file && file.size <= 10_000_000; // File size must be less than or equal to 10MB
      },
      {
        message: "Le fichier est trop volumineux",
      },
    ),
  image_url: z.string().optional(),
});

export type ProductForm = z.infer<typeof ProductFormSchema>;

export const UpdateProductFormSchema = ProductFormSchema.omit({
  image: true,
}).extend({
  image: ProductFormSchema.shape.image.optional(),
});

export type UpdateProductForm = z.infer<typeof UpdateProductFormSchema>;
