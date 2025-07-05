import { api } from "@/lib/ky";
import { formatStrapiResponse } from "@/lib/strapi";
import {
  CreatePurchaseBodyParamsRequest,
  CreatePurchaseNewUserBody,
  CreatePurchaseResponse,
  ReadAllPurchaseResponse,
  UpdateManyPurchaseReq,
  UpdateManyPurchaseResponse,
  UpdatePurchaseRequest,
  UpdatePurchaseResponse,
} from "./purchase-api.type";
import { DeleteResponse } from "@/types/strapi.type";
import { Purchase } from "@/types/purchase.type";

export class PurchaseApi {
  static async create(createPurchaseBody: CreatePurchaseBodyParamsRequest) {
    return formatStrapiResponse(
      await api
        .post("purchases", {
          json: { data: createPurchaseBody },
        })
        .json<CreatePurchaseResponse>()
    );
  }
  static async createForNewUser(createPurchaseBody: CreatePurchaseNewUserBody) {
    return formatStrapiResponse(
      await api
        .post("purchases/create-for-new-user", {
          json: { data: createPurchaseBody },
        })

        .json<CreatePurchaseResponse>()
    );
  }
  static async readAll() {
    const result = formatStrapiResponse(
      await api.get("purchases?populate=deep,3").json<ReadAllPurchaseResponse>()
    );
    return result;
  }

  static async update(id: number | string, body: UpdatePurchaseRequest) {
    const result = formatStrapiResponse(
      await api
        .put(`purchases/${id}`, { json: { data: body } })
        .json<UpdatePurchaseResponse>()
    );
    return result;
  }

  static async updateMany(data: UpdateManyPurchaseReq) {
    return formatStrapiResponse(
      await api.put(`purchases/update-many`, { json: { data } })
        .json<UpdateManyPurchaseResponse>()
    )
  }
  static async delete(id: number) {
    return await api.delete(`purchases/${id}`).json<DeleteResponse>();
  }
}
