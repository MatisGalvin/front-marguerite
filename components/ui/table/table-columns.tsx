import { ColumnDef, HeaderContext, Row } from "@tanstack/react-table";
import { ArrowUpDown, LucideIcon, MoreHorizontal } from "lucide-react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Id } from "@/types/strapi.type";

export type CustomHeaderCol<T> = {
  key: keyof T;
  label: string;
  isShow?: boolean;
};

export type CustomHeader<T> = {
  onCheckedAll?: (value: boolean) => void;
  onCheckRow?: (id: Id, isChecked: boolean) => void;
  columns: (Omit<ColumnDef<T>, "key"> & CustomHeaderCol<T>)[];
  actions?: {
    isShow?: (row: T) => boolean;
    label: (row: T) => string;
    icon: (row: T) => LucideIcon;
    onClick: (orignalData: T, row: Row<Partial<T>>) => void;
  }[];
};

export type CustomHeadersPartial<T> = {
  onCheckedAll?: (value: boolean) => void;

  onCheckRow?: (id: Id, isChecked: boolean) => void;
  columns: (Omit<ColumnDef<Partial<T>>, "key"> & CustomHeaderCol<T>)[];
  actions?: {
    isShow?: (row: T) => boolean;
    label: (row: T) => string;
    icon: (row: T) => LucideIcon;
    onClick: (orignalData: T, row: Row<Partial<T>>) => void;
  }[];
};

export function tableColumns<T>(headers: {
  onCheckedAll?: (value: boolean) => void;
  onCheckRow?: (id: Id, isChecked: boolean) => void;
  columns: (Omit<ColumnDef<Partial<T>>, "key"> & CustomHeaderCol<T>)[];
  actions?: {
    isShow?: (row: T) => boolean;
    label: (row: T) => string;
    icon: (row: T) => LucideIcon;
    onClick: (orignalData: T, row: Row<Partial<T>>) => void;
  }[];
}): ColumnDef<Partial<T>>[] {

  const actions: ColumnDef<Partial<T>> = {
    id: "actions",

    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {headers.actions
              ?.filter(
                (action) => !action.isShow || action.isShow(row.original as T),
              )
              .map((action) => {
                const Icon = action.icon(row.original as T);
                return (
                  <div key={action.label(row.original as T)}>
                    <DropdownMenuItem
                      onClick={(e) => {
                        action.onClick(row.original as T & { id: string }, row);
                        e.stopPropagation();
                      }}
                    >
                      <Icon height={18} width={18} className="pr-1" />
                      {action.label(row.original as T)}
                    </DropdownMenuItem>
                  </div>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  let columns: ColumnDef<Partial<T>>[] = [
    ...headers.columns
      .filter((col) => col.key !== "id")
      .map(({ key, ...headerCol }) => {
        return {
          accessorKey: key,
          id: key as string,
          ...headerCol,
          header: ({ column }: HeaderContext<Partial<T>, unknown>) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="-m-4"
              >
                {headerCol.label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          },
        };
      }),
  ];
  if (headers.columns.some((headerCol) => headerCol.key === "id")) {
    columns = [
      {
        accessorKey: "id",
        id: "id",

        header: ({ table }) => (
          <span className="flex">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value)
                headers.onCheckedAll?.(!!value)
              }
              }
              aria-label="Select all"
            />
          </span>
        ),
        cell: ({ row }) => (
          <div
            className=" flex h-10 flex-col justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)

                headers.onCheckRow?.((row.original as T & { id: Id }).id, !!value)
              }}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];
  }

  if (headers.actions) {
    columns.push(actions);
  }
  return columns;
}
