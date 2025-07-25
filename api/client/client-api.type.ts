import { Client } from "@/types/client.type";
import { Id, StrapiResult, StrapiResultList } from "@/types/strapi.type";

/* Create Client  */
export type CreateClientBodyParamsRequest = Pick<
  Client,
  "firstname" | "lastname" | "email" | "phoneNumber"
>;

export type CreateClientResponse = StrapiResult<Client>;

/* Read all clients */
export type ReadAllClientResponse = StrapiResultList<Client>;

/* Update client */
export type UpdateClientRequest = Pick<
  Client,
  "id" | "firstname" | "lastname" | "email" | "phoneNumber"
>;
export type UpdateClientResponse = StrapiResult<Client>;

/* Check email existence */
export type checkClientExistResponse = {
  data: {
    exists: boolean;
  };
};

export type checkClientExistRequest = {
  email: string;
  userId: Id;
};
