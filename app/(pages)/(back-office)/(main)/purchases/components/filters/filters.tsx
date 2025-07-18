import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PURCHASE_LABEL_STATUS } from "@/constants/purchase";
import { Table as TableTanStack } from "@tanstack/react-table";
import { FormatTableItem } from "../../page";

export const PurchaseStatusFilter = (p: {
  table: TableTanStack<Partial<FormatTableItem>>;
}) => {
  const currentFilterValue = p.table.getColumn("status")?.getFilterValue() as
    | keyof typeof PURCHASE_LABEL_STATUS
    | "all";

  const handleTabChange = (value: string) => {
    if (value == "all") {
      p.table.getColumn("status")?.setFilterValue("");
      p.table.getColumn("isSeenByUser")?.setFilterValue(undefined);
    } else if (value === "is_seen_by_user") {
      p.table.getColumn("status")?.setFilterValue("");
      p.table.getColumn("isSeenByUser")?.setFilterValue(false);
    } else {
      p.table.getColumn("isSeenByUser")?.setFilterValue(undefined);
      p.table.getColumn("status")?.setFilterValue(value);
    }
  };

  return (
    <Tabs
      defaultValue={currentFilterValue || "all"}
      onValueChange={handleTabChange}
    >
      <TabsList>
        <TabsTrigger value="all">Toutes les commandes</TabsTrigger>
        <TabsTrigger key={"is_seen_by_user"} value={"is_seen_by_user"}>
          Commandes non vues
        </TabsTrigger>
        {...Object.keys(PURCHASE_LABEL_STATUS)
          .filter((statusKey) => statusKey !== "purchase-archived")
          .map((statusKey) => (
            <TabsTrigger key={statusKey} value={statusKey}>
              {
                PURCHASE_LABEL_STATUS[
                  statusKey as keyof typeof PURCHASE_LABEL_STATUS
                ]
              }
            </TabsTrigger>
          ))}
      </TabsList>
    </Tabs>
  );
};
