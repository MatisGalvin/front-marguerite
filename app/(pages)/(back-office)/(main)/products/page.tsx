"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { Barcode, CheckIcon, Pencil, Trash2Icon } from "lucide-react";
import cowPng from "@/assets/images/auth-cow.png";

import { dialog } from "@/components/ui/alert-dialog";

import { ProductApi } from "@/api/products/product-api";
import { Badge } from "@/components/ui/badge";
import { useProductsMe } from "@/hooks/api";
import { toast } from "@/hooks/toast";
import { queryClient } from "@/lib/react-query";
import { Product, ProductUnit } from "@/types/product.type";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { CreateProductSheet } from "./create-product-sheet/create-product-sheet";
import { UpdateProductSheet } from "./update-product-sheet/update-product-sheet";
export default function Products() {
  const { data: products } = useProductsMe();
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (productId: number) => ProductApi.delete(productId),
    onSuccess: () => {
      toast({
        title: "",
        description: (
          <div>
            <div className="text-md flex gap-1 font-bold">
              {" "}
              Suppression du produit{" "}
              <CheckIcon className="absolute right-4" color="green" />
            </div>
            <div className=" mt-2">Le produit à été supprimé avec succès</div>
          </div>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast({
        title: "Erreur de suppression",
        description:
          "Une erreur est survenue lors de la suppression du produit.",
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <Barcode size={25} />
        Mes produits
      </h1>
      <CreateProductSheet />
      {selectedProduct && (
        <UpdateProductSheet
          isOpen={selectedProduct !== undefined}
          product={selectedProduct}
          onOpenChange={() => setSelectedProduct(undefined)}
        />
      )}
      <div>
        <DataTable
          data={products}
          headers={{
            columns: [
              {
                key: "image",
                label: "Image",
                cell: ({ row: { original: product } }) => (
                  <Image
                    src={product.image.url ? `${product.image.url}` : cowPng}
                    alt={product.image.alternativeText || "Product Image"}
                    width={100}
                    height={100}
                    className="rounded-md"
                    style={{ width: "auto", height: "auto" }}
                  />
                ),
              },
              {
                key: "name",
                label: "Nom & Description",
                cell: ({ row: { original: product } }) => (
                  <div>
                    <div className="mb-2 font-bold">{product.name}</div>
                    <div className="!w-[20rem] text-xs">
                      {product.description}
                    </div>
                  </div>
                ),
              },
              { key: "description", label: "Description", isShow: false },
              {
                key: "price",
                label: "Prix",
                cell: ({ row: { original: product } }) => (
                  <div className="font-bold">
                    {product.price.toFixed(2)} €{" / "}
                    {product.unit == "quantity" ? "unité" : " kg"}
                  </div>
                ),
              },
              { key: "unit", label: "Unité", isShow: false },
              {
                key: "product_options",
                label: "Options",
                cell: ({ row: { original: product } }) => (
                  <div className="flex gap-2">
                    {product.product_options?.map((option) => (
                      <Badge key={option} variant={"outline"}>
                        {option +
                          " " +
                          (product.unit == "quantity" ? "" : "kg")}
                      </Badge>
                    ))}
                  </div>
                ),
              },
            ],
            actions: [
              {
                icon: () => Pencil,
                label: () => "Editer",
                onClick: (product) => {
                  setSelectedProduct(product);
                },
              },
              {
                icon: () => Trash2Icon,
                label: () => "Supprimer",
                onClick: (product) => {
                  dialog({
                    title: "Supprimer un produit",
                    description:
                      "Vous êtes sur le point de supprimer un produit. C'est irreversible.",
                    primaryAction: {
                      type: "destructive",
                      onClick: () => {
                        deleteProduct(product.id);
                      },
                    },
                  });
                },
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
