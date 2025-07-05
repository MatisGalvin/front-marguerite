import { ClientApi } from "@/api/client/client-api";
import { ProductApi } from "@/api/products/product-api";
import { PurchaseApi } from "@/api/purchase/purchase-api";
import { SaleAPI } from "@/api/sale/sale-api";
import { UserAPI } from "@/api/user/user-api";
import { User } from "@/types/user.type";
import { DefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

/* PURCHASE */
export function usePurchasesMe() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: PurchaseApi.readAll,
  });
}

/* CLIENT */
export function useClientsMe() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: ClientApi.readAll,
  });
}

export function useSalesMe() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: () => SaleAPI.readAll(),
  });
}

export function useSales(searchParams?: { userId: string }) {
  return useQuery({
    queryKey: ["sales"],
    queryFn: () => SaleAPI.readAll(searchParams),
  });
}

/* PRODUCT */
export function useProductsMe() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ProductApi.readAll(),
  });
}

export function useProducts(searchParams: { userId: string }) {
  return useQuery({
    queryKey: [`products-of-user-${searchParams?.userId}`],
    queryFn: () => ProductApi.readAll(searchParams),
  });
}

/* USER */
export function useMe(
  queryOptions?: Partial<
    DefinedInitialDataOptions<User, Error, User, string[]>
  >,
) {
  return useQuery({
    queryKey: ["user"],
    queryFn: UserAPI.me,
    ...queryOptions,
  });
}
