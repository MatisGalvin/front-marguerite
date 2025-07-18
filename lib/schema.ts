import { z } from "zod";

export const PhoneNumberSchema = z.string().regex(/^\d{10}$/, {
  message: "Le numéro de téléphone doit être composé de 10 chiffres.",
});

export const EmailSchema = z.string().email().min(1, "Requis");

export const RequiredTextSchema = z.string().min(1, "Requis");
export const RequiredNumberSchema = z.number();
export const IDSchema = z.string().min(1, "Requis").or(z.number());

export const RequiredPostiveNumberSchema = z
  .number()
  .nullable()
  .refine((value) => value !== null && value > 0, {
    message: "Doit être supérieur à 0",
  });

export const RequiredPostiveNoNullNumberSchema = z
  .number()
  .refine((value) => value > 0, {
    message: "Requis",
  });
