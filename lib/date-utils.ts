import { format } from "date-fns";
import { fr } from "date-fns/locale";
// 1er mai 2024
export const formatDate = (date: string) => {
  return format(date, "PPP", { locale: fr });
};

export function toPrettyDate(date: string | Date) {
  let d = typeof date == "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
