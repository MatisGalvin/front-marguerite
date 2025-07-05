"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  Row,
  SortingState,
  Table as TableTanStack,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import { LucideIcon, SearchIcon } from "lucide-react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Input } from "../input";
import { DataTablePagination } from "./pagination";
import {
  CustomHeader,
  CustomHeadersPartial,
  tableColumns,
} from "./table-columns";
import { t } from "i18next";
import { table } from "console";

export type TableAction<T> = {
  isShow?: (row: T) => boolean;
  label: (row: T) => string;
  icon: (row: T) => LucideIcon;
  onClick: (originalData: T, row: Row<Partial<T>>) => void;
};
interface DataTableProps<TData, TValue> {
  headers: CustomHeader<TData>;
  classNameRows?: { [rowId: number]: string };
  sort?: SortingState;
  data?: TData[];
  displaySelectColumns?: boolean;
  renderChild?: (table: TableTanStack<Partial<TData>>) => ReactNode;
  onClickRow?: (data: TData, row: Row<Partial<TData>>) => void;
  hasSearch?: boolean;
  onRowSelectionChange?: (rows: Record<number, boolean>) => void;
  pageSize?: number;
  className?: string;
}

/**
 * Global filter by text
 */
const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}) => (
  <div className="relative h-10 w-full">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform " />
    <Input
      placeholder="Recherche"
      value={globalFilter}
      onChange={(event) => setGlobalFilter(event.target.value)}
      className="max-w-sm py-2 pl-10 pr-3"
    />
  </div>
);

export function DataTable<TData, TValue>({
  headers,
  data,
  sort,
  classNameRows,
  onClickRow,
  renderChild,
  className,
  hasSearch = true,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(sort || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const initialColumnVisibility = headers.columns.reduce((acc, column) => {
    acc[column.key as string] = column.isShow !== false;
    return acc;
  }, {} as VisibilityState);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  );
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: data ?? [],
    columns: tableColumns<TData>(headers as CustomHeadersPartial<TData>),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    onRowSelectionChange: (value: any) => {
      setRowSelection(value);
    },
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: globalFilter,
    },
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  return (
    <div className={cx(" overflow-y-scroll", className)}>
      <div className="flex items-center py-4">
        {hasSearch && (
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
      </div>
      {renderChild?.(table)}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickRow?.(row.original as TData, row);
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cx(
                      onClickRow && "cursor-pointer",

                      classNameRows?.[
                        (row.original as typeof row.original & { id: number })
                          .id
                      ],
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.columns.length}
                  className="h-24 text-center"
                >
                  Pas de données
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        {table.getRowCount() > 10 && <DataTablePagination table={table} />}
      </div>
    </div>
  );
}

export const getRowClassNames = (array: any[], className: string) => {
  return array?.reduce((acc, item) => {
    return { ...acc, [item.id]: className };
  }, {});
};
