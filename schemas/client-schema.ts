import { PhoneNumberSchema } from "@/lib/schema";
import { z } from "zod";

export const ClientFormSchema = z.object({
  firstname: z.string().min(2, {
    message: "Le nom d'utilisateur doit comporter au moins 2 caractères.",
  }),
  lastname: z.string().min(2, {
    message: "Le nom d'utilisateur doit comporter au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Doit être un mail valide.",
  }),
  phoneNumber: PhoneNumberSchema,
});

export type ClientForm = z.infer<typeof ClientFormSchema>;
