import { api } from "@/lib/ky";
import { formatStrapiResponse } from "@/lib/strapi";
import {
  CreateSaleResponse,
  ReadAllSaleResponse,
  UpdateSaleBody,
  UpdateSaleResponse,
} from "./sale-api.type";
import { CreateSaleForm } from "@/schemas/sale-schema";
import { Id } from "@/types/strapi.type";

export class SaleAPI {
  static async readAll(searchParams?: { userId: string }) {
    const result = formatStrapiResponse(
      await api
        .get("sales", searchParams?.userId ? { searchParams } : undefined)
        .json<ReadAllSaleResponse>(),
    );
    console.log("SaleAPI.readAll", result);
    return result;
  }
  static async create(body: CreateSaleForm) {
    const result = formatStrapiResponse(
      await api.post("sales", { json: body }).json<CreateSaleResponse>(),
    );
    return result;
  }

  static async update(id: Id, body: UpdateSaleBody) {
    const result = formatStrapiResponse(
      await api.put(`sales/${id}`, { json: body }).json<UpdateSaleResponse>(),
    );
    return result;
  }
}
