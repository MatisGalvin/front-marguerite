import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate } from "@/lib/date-utils";
import { Purchase } from "@/types/purchase.type";
import { Calendar, Mail, Package, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, getRowClassNames } from "@/components/ui/table/data-table";
import Image from "next/image";
import { useProductsMe } from "@/hooks/api";
import { formatPhoneNumber } from "@/lib/format";
import { BadgeStatus } from "../../../components/badge-status/badge-status";

export function DetailPurchaseSheet(p: {
  purchase: Purchase;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
}) {
  const { data: products } = useProductsMe();
  const formattedTable = p.purchase.purchase_items.map((item) => {
    return {
      id: item.id,
      quantity: "x" + item.quantity,
      productName: item.product.name,
      product_option: item.product_option
        ? item.product_option + " " + item.product.unit
        : "",
      image: products?.find((product) => product.id === item.product.id)?.image
        .url,
      total_price: item.total_price.toFixed(2) + " €",
      product_extra: item.product_extra,
    };
  });

  const clientCard = (
    <Card className="px-2 text-xs ">
      <CardContent className="p-4 ">
        <div className="font-bold text-black flex items-center gap-1 ">
          <User size={18} />
          <div className=" text-lg">
            {p.purchase.client.firstname} {p.purchase.client.lastname}
          </div>
        </div>
        <div className="text-gray-500 flex gap-2 items-center">
          <Mail className="h-3 w-3" />
          {p.purchase.client.email}
        </div>
        <div className="text-gray-500 flex gap-2 items-center">
          <Phone className="h-3 w-3" />
          {formatPhoneNumber(p.purchase.client.phoneNumber)}
        </div>
      </CardContent>
    </Card>
  );

  const sellCard = (
    <Card className="px-2 text-xs ">
      <CardContent className="p-4 ">
        <div className="font-bold text-black text-lg">
          {p.purchase.sale.name}
        </div>
        <div className="text-gray-500 flex gap-2 items-center">
          <Calendar className="h-3 w-3" />
          {formatDate(p.purchase.sale.startDate)}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Sheet open={p.isOpen} onOpenChange={p.onOpenChange}>
      <SheetContent
        className="w-auto md:max-w-[750px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="flex justify-between">
            <div>
              <div className="flex justify-between">
                <div className="flex items-start">
                  <Package className="h-4 w-4 mr-2 mt-2" /> Commande #{" "}
                  {p.purchase.id}
                </div>
                <BadgeStatus
                  color={p.purchase.is_paid ? "green" : "yellow"}
                  className="mr-6"
                >
                  {p.purchase.is_paid ? "Payé" : "En attente de paiement"}
                </BadgeStatus>
              </div>
              <div className="text-xs text-gray-500">
                Créé le {formatDate(p.purchase.createdAt)}
              </div>
              <div className={`mt-6 flex gap-2`}>
                {clientCard}
                {sellCard}
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <h2 className="mt-8 text-base font-bold">Détail de la commande</h2>
        <DataTable
          hasSearch={false}
          data={formattedTable}
          headers={{
            columns: [
              {
                key: "productName",
                label: "Produit",
                cell: ({ row: { original } }) => {
                  return (
                    <div className="flex flex-col gap-2">
                      <Image
                        src={original.image!}
                        className="rounded-md"
                        alt="product image"
                        width={70}
                        height={70}
                      />{" "}
                      <span className="text-gray-700">
                        {" "}
                        {original.productName}
                      </span>
                    </div>
                  );
                },
              },
              { key: "quantity", label: "Quantité" },
              { key: "product_extra", label: "Option" },
              { key: "product_option", label: "Format" },
              { key: "total_price", label: "Prix" },
            ],
          }}
          classNameRows={getRowClassNames(p.purchase.purchase_items, "text-md")}
        />
        <div className=" flex justify-end font-bold">
          Total : {p.purchase.total_price.toFixed(2) + " €"}
        </div>
      </SheetContent>
    </Sheet>
  );
}
