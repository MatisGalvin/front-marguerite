import { api } from "@/lib/ky";
import { formatStrapiResponse } from "@/lib/strapi";
import {
  CreateProductResponse,
  ReadAllProductRequest,
  ReadAllProductResponse,
  UpdateProductResponse,
} from "./product-api.type";

export class ProductApi {
  static async create(createProductBody: FormData) {
    return formatStrapiResponse(
      await api
        .post("products", {
          body: createProductBody,
        })
        .json<CreateProductResponse>(),
    );
  }
  static async readAll(request?: ReadAllProductRequest) {
    const strapiResponse = await api
      .get(
        "products",
        request?.userId
          ? { searchParams: { userId: request?.userId } }
          : undefined,
      )
      .json<ReadAllProductResponse>();
    const result = formatStrapiResponse(strapiResponse);
    return result;
  }

  static async update(id: number, formData: FormData) {
    const result = formatStrapiResponse(
      await api
        .put(`products/${id}`, { body: formData })
        .json<UpdateProductResponse>(),
    );
    return result;
  }

  static async delete(id: number) {
    return await api.delete(`products/${id}`).json();
  }
}
