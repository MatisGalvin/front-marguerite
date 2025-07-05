"use client";

import { ClientApi } from "@/api/client/client-api";
import { DataTable, TableAction } from "@/components/ui/table/data-table";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, Pencil, Trash2Icon, User } from "lucide-react";

import { dialog } from "@/components/ui/alert-dialog";
import { useClientsMe } from "@/hooks/api";
import { toast } from "@/hooks/toast";
import { useToggle } from "@/hooks/toggle";
import { queryClient } from "@/lib/react-query";
import { Client } from "@/types/client.type";
import { useMemo, useState } from "react";
import {
  ClientEmailCell,
  ClientIdentityCell,
  ClientPhoneNumberCell,
} from "./components/client-cells/client-cells";
import { CreateClientSheet } from "./components/create-client-sheet/create-client-sheet";
import { UpdateClientSheet } from "./components/update-client-sheet/update-client-sheet";

export default function Clients() {
  const {
    isOpen: isUpdateSheetOpen,
    toggle: toggleUpdateSheet,
    open: openUpdateSheet,
  } = useToggle();
  const [selectedClient, setSelectedClient] = useState<Client>();
  const { data: clients } = useClientsMe();

  const { mutate: deleteClient } = useMutation({
    mutationFn: async (client: Client) => {
      return ClientApi.delete(client.id);
    },
    onSuccess: () => {
      toast({
        title: "",
        description: (
          <div>
            <div className="text-md flex gap-1 font-bold">
              Suppression du client
              <CheckIcon className="absolute right-4" color="green" />
            </div>
            <div className=" mt-2">Le client à été supprimé avec succès</div>
          </div>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Echec : Suppression client",
        description: `Une erreur est survenue lors de la suppression du client`,
      });
    },
  });

  const tableActions: TableAction<Client>[] = useMemo(
    () => [
      {
        icon: () => Pencil,
        label: () => "Editer",
        onClick: (client) => {
          setSelectedClient(client);
          openUpdateSheet();
        },
      },
      {
        icon: () => Trash2Icon,
        label: () => "Supprimer",
        onClick: (client) => {
          dialog({
            title: "Suppression client",
            description: `Vous êtes sur le point de supprimer le client ${client.firstname} ${client.lastname}. Cette action est irréversible et supprimera également toutes les commandes associées à ce client`,
            primaryAction: {
              type: "destructive",

              onClick: () => {
                deleteClient(client);
              },
            },
          });
        },
      },
    ],
    [deleteClient, openUpdateSheet],
  );

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <User size={25} />
        Mes clients
      </h1>
      <CreateClientSheet />
      {selectedClient && isUpdateSheetOpen && (
        <UpdateClientSheet
          isOpen={isUpdateSheetOpen}
          onOpenChange={toggleUpdateSheet}
          client={selectedClient}
        />
      )}

      <div>
        <DataTable
          data={clients}
          headers={{
            columns: [
              {
                key: "firstname",
                label: "Client",
                cell: ClientIdentityCell,
              },
              { key: "email", label: "Email", cell: ClientEmailCell },
              {
                key: "phoneNumber",
                label: "Téléphone",
                cell: ClientPhoneNumberCell,
              },
            ],
            actions: tableActions,
          }}
        />
      </div>
    </div>
  );
}
