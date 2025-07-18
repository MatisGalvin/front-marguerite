import { PurchaseStatus } from "@/types/purchase.type";

export const PURCHASE_LABEL_STATUS: Record<PurchaseStatus, string> = {
  "purchase-pending": "Commande en cours",
  "purchase-completed": "Commande terminée",
  // "purchase-cancelled": "Commande annulée",
  "purchase-archived": "Commande archivée",
};
