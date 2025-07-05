import { api } from "@/lib/ky";
import { Client } from "@/types/client.type";
import { formatStrapiResponse } from "@/lib/strapi";
import {
  checkClientExistRequest,
  checkClientExistResponse,
  CreateClientBodyParamsRequest,
  CreateClientResponse,
  ReadAllClientResponse,
  UpdateClientRequest,
  UpdateClientResponse,
} from "./client-api.type";
import { DeleteResponse } from "@/types/strapi.type";

export class ClientApi {
  static async create(createClientBody: CreateClientBodyParamsRequest) {
    const resp = await api
      .post("clients", {
        json: { data: createClientBody },
      })
      .json<CreateClientResponse>();
    return formatStrapiResponse(resp);
  }
  static async readAll() {
    const result = formatStrapiResponse(
      await api.get("clients").json<ReadAllClientResponse>(),
    );
    return result;
  }

  static async update({ id, ...client }: UpdateClientRequest) {
    const result = formatStrapiResponse(
      await api
        .put(`clients/${id}`, { json: { data: client } })
        .json<UpdateClientResponse>(),
    );
    return result;
  }

  static async delete(id: number) {
    return await api.delete(`clients/${id}`).json<DeleteResponse>();
  }

  static async checkClientExist(searchParams: checkClientExistRequest) {
    return await api
      .get(
        `clients/check-client-exist?email=${searchParams.email}&userId=${searchParams.userId}`,
      )
      .json<checkClientExistResponse>();
  }
}
