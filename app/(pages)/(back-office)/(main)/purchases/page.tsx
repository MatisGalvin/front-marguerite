"use client";

import { DataTable, TableAction } from "@/components/ui/table/data-table";
import { useMutation } from "@tanstack/react-query";
import {
  Archive,
  CheckCheck,
  CheckCircle,
  CheckIcon,
  CircleOff,
  Package,
  Pencil,
} from "lucide-react";

import { PurchaseApi } from "@/api/purchase/purchase-api";
import { UpdatePurchaseRequest } from "@/api/purchase/purchase-api.type";
import { dialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePurchasesMe, useSales, useSalesMe } from "@/hooks/api";
import { toast } from "@/hooks/toast";
import { useToggle } from "@/hooks/toggle";
import { queryClient } from "@/lib/react-query";
import { Client } from "@/types/client.type";
import { Purchase, PurchaseItem, PurchaseStatus } from "@/types/purchase.type";
import { Id } from "@/types/strapi.type";
import { cx } from "class-variance-authority";
import { format, parse as parseToDate } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { ClientIdentityCell } from "../clients/components/client-cells/client-cells";
import { BadgeStatus } from "../components/badge-status/badge-status";
import { CreatePurchaseSheet } from "./components/create-puchase-sheet/create-puchase-sheet";
import { DetailPurchaseSheet } from "./components/detail-purchase-sheet/detail-purchase-sheet";
import { PurchaseStatusFilter } from "./components/filters/filters";
import { UpdatePurchaseSheet } from "./components/update-purchase-sheet/update-purchase-sheet";

export default function Purchases() {
  const { data: purchases } = usePurchasesMe();

  const {
    isOpen: isDetailSheetOpen,
    close: closeDetailSheet,
    setIsOpen: setIsDetailSheetOpen,
  } = useToggle(false);
  const [selectedRows, setSelectedRows] = useState<Id[]>([]);
  const { isOpen: isUpdateSheetOpen, setIsOpen: setIsUpdateSheetOpen } =
    useToggle();
  const [currentPurchaseToUpdate, setCurrentPurchaseToUpdate] =
    useState<Purchase>();
  const [currentPurchaseDetail, setCurrentPurchaseDetail] =
    useState<Purchase>();
  const shouldShowToastFeedbackRef = useRef(true);
  const purchasesWithoutArchived = purchases?.filter(
    (purchase) => purchase.status !== "purchase-archived",
  );
  const formattedPurchases = useMemo(
    () => (purchases ? formatTableData(purchasesWithoutArchived!) : []),
    [purchases, purchasesWithoutArchived],
  );

  const { mutate: updatePurchase } = useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdatePurchaseRequest & { id: number | string }) =>
      PurchaseApi.update(id, payload),
    onSuccess: () => {
      if (shouldShowToastFeedbackRef.current == true) {
        toast({
          title: "",
          description: (
            <div>
              <div className="text-md flex gap-1 font-bold">
                Commande mise à jour{" "}
                <CheckIcon className="absolute right-4" color="green" />
              </div>
              <div className=" mt-2">
                La commande à été mise à jour avec succès
              </div>
            </div>
          ),
        });
      }
    },
    onError: () => {
      if (shouldShowToastFeedbackRef.current == true) {
        toast({
          variant: "destructive",
          title: "Echec : Mise à jour de la commande",
          description: `Une erreur est survenue lors de la mise à jour de la commande`,
        });
      }
    },
    onSettled: () => {
      shouldShowToastFeedbackRef.current = true;
    },
  });

  const { mutate: updateManyPurchases } = useMutation({
    mutationFn: PurchaseApi.updateMany,
    onSuccess: () => {
      toast({
        title: "Commandes mises à jour",
        description: "Les commandes ont été marquées commme vues",
      });

      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Echec : Mise à jour des commandes",
        description:
          "Une erreur est survenue lors de la mise à jour des commandes",
      });
    },
  });

  const markAllCheckedPurchaseAsSeen = () => {
    updateManyPurchases(
      selectedRows.map((purchaseId) => {
        return {
          id: purchaseId,
          is_seen_by_user: true,
        };
      }),
    );
  };
  const getRowClassNames = () => {
    return formattedPurchases?.reduce((acc, purchase) => {
      return {
        ...acc,
        [purchase.id]: cx(!purchase.isSeenByUser && "font-bold"),
        // purchase.status === "purchase-archived" && "bg-black-100/20",
        // purchase.status === "purchase-completed" && "bg-green-100/40"
      };
    }, {});
  };

  const tableActions: TableAction<FormatTableItem>[] = useMemo(
    () => [
      {
        isShow: (row) => !row.isPaid && row.status !== "purchase-archived",
        icon: () => CheckCircle,
        label: () => "Commande payée",
        onClick: (formatedPurchase) => {
          updatePurchase({
            id: formatedPurchase.id,
            is_paid: true,
            status: "purchase-completed",
          });
        },
      },
      {
        isShow: (row) => row.isPaid && row.status !== "purchase-archived",
        icon: () => CircleOff,
        label: () => "Commande impayée",
        onClick: (formatedPurchase) => {
          updatePurchase({
            id: formatedPurchase.id,
            is_paid: false,
            status: "purchase-pending",
          });
        },
      },
      {
        icon: () => Pencil,
        label: () => "Editer",
        onClick: (_formatedPurchase, row) => {
          setCurrentPurchaseToUpdate(purchasesWithoutArchived?.[row.index]);
          setIsUpdateSheetOpen(true);
        },
      },

      {
        isShow: (row) => row.status !== "purchase-archived",
        icon: () => Archive,
        label: () => "Archiver",
        onClick: (formatedPurchase) => {
          dialog({
            description:
              "Archiver la commande, ne supprime pas la commande définitevement vous pourrez toujours la retrouver dans votre historique",
            title: "Archiver la commande ?",
            primaryAction: {
              type: "warning",

              onClick: () => {
                updatePurchase({
                  id: formatedPurchase.id,
                  status: "purchase-archived",
                });
              },
            },
          });
        },
      },
    ],
    [updatePurchase, setIsUpdateSheetOpen, purchases],
  );

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <Package size={25} />
        Mes commandes
      </h1>
      <CreatePurchaseSheet />
      {currentPurchaseDetail && (
        <DetailPurchaseSheet
          isOpen={isDetailSheetOpen}
          purchase={currentPurchaseDetail}
          onClose={closeDetailSheet}
          onOpenChange={setIsDetailSheetOpen}
        />
      )}

      {currentPurchaseToUpdate && (
        <UpdatePurchaseSheet
          purchase={currentPurchaseToUpdate}
          isOpen={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
        />
      )}

      <div className="mt-10">
        <DataTable
          data={formattedPurchases}
          onClickRow={(_purchase, row) => {
            setCurrentPurchaseDetail(purchasesWithoutArchived?.[row.index]);
            setIsDetailSheetOpen(true);
            if (!_purchase.isSeenByUser) {
              shouldShowToastFeedbackRef.current = false;
              updatePurchase({
                id: _purchase.id,
                is_seen_by_user: true,
              });
            }
          }}
          headers={{
            onCheckedAll: (checked) => {
              setSelectedRows(
                checked
                  ? formattedPurchases.map((purchase) => purchase.id)
                  : [],
              );
            },
            onCheckRow: (rowId, isChecked) => {
              setSelectedRows(
                isChecked
                  ? [...selectedRows, rowId]
                  : selectedRows.filter((id) => id !== rowId),
              );
            },
            columns: [
              { key: "id", label: "" },
              { key: "purchaseId", label: "#" },
              {
                key: "client",
                label: "Client",
                cell: ClientIdentityCell,
              },
              {
                key: "createdAt",
                label: "Créée le",
                sortingFn: (a, b) => {
                  return (
                    parseToDate(
                      a.original.createdAt!,
                      "dd/MM/yyyy HH:mm",
                      new Date(),
                    ).getTime() -
                    parseToDate(
                      b.original.createdAt!,
                      "dd/MM/yyyy HH:mm",
                      new Date(),
                    ).getTime()
                  );
                },
              },
              { key: "sale", label: "Vente" },
              { key: "productCount", label: "Nombre de produits" },

              {
                key: "isPaid",
                label: "Statut du paiement",
                cell: ({ row: { original: row } }) => {
                  return (
                    row.status !== "purchase-archived" &&
                    (row.isPaid ? (
                      <BadgeStatus color="green">Payé</BadgeStatus>
                    ) : (
                      <BadgeStatus color="yellow">
                        En attente de paiement
                      </BadgeStatus>
                    ))
                  );
                },
              },
              {
                key: "totalPrice",
                label: "Prix total",
                cell: ({ row: { original: row } }) => {
                  return <div className="">{row.totalPrice + " €"}</div>;
                },
              },
              { key: "firstname", label: "Nom", isShow: false },
              { key: "lastname", label: "Prenom", isShow: false },
              { key: "email", label: "Email", isShow: false },
              { key: "status", label: "Statut", isShow: false },
              { key: "purchaseItems", label: "Produits", isShow: false },
              { key: "isSeenByUser", label: "Vu", isShow: false },
              {
                key: "nameAndFirstName",
                label: "Name and FirstName",
                isShow: false,
              },
            ],
            actions: tableActions,
          }}
          classNameRows={getRowClassNames()}
          sort={[{ id: "createdAt", desc: true }]}
          renderChild={(table) => (
            <div className="flex flex-col gap-4">
              <PurchaseStatusFilter table={table} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        markAllCheckedPurchaseAsSeen();
                        table.toggleAllRowsSelected(false);
                        setSelectedRows([]);
                      }}
                      variant={"outline"}
                      className={cx(
                        "m-2 h-8 w-8 p-0",
                        selectedRows.length === 0 && "invisible",
                      )}
                    >
                      <CheckCheck size={20} className={cx("m-2")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tout marquer comme vu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export type FormatTableItem = {
  id: Id;
  purchaseId: Id;
  createdAt: string;
  client: Client;
  sale: string;
  productCount: number;
  status: PurchaseStatus;
  isPaid: boolean;
  firstname: string;
  lastname: string;
  email: string;
  nameAndFirstName: string;
  totalPrice: number;
  isSeenByUser: boolean;
  phoneNumber: string;
  purchaseItems: PurchaseItem[];
};

function formatTableData(purchases: Purchase[]): FormatTableItem[] {
  return purchases.map((purchase) => ({
    id: purchase.id,
    purchaseId: purchase.id,
    //format to have the hours and minutes
    createdAt: format(new Date(purchase.createdAt), "dd/MM/yyyy HH:mm"),
    client: purchase.client,
    sale: purchase.sale.name,
    productCount: purchase.purchase_items
      .map((item) => item.quantity)
      .reduce((acc, qty) => acc + qty, 0),
    status: purchase.status,
    isPaid: purchase.is_paid,
    phoneNumber: purchase.client.phoneNumber,
    firstname: purchase.client.firstname,
    lastname: purchase.client.lastname,
    email: purchase.client.email,
    nameAndFirstName:
      purchase.client.firstname + " " + purchase.client.lastname,
    totalPrice: purchase.total_price,
    isSeenByUser: purchase.is_seen_by_user,
    purchaseItems: purchase.purchase_items,
  }));
}
