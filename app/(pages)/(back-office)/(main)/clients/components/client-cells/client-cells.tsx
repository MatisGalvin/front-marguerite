import { CellContext } from "@tanstack/react-table";
import { Mail, PhoneIcon } from "lucide-react";

// Various cell you can reuse

export function ClientIdentityCell<
  T extends {
    lastname: string;
    email: string;
    firstname: string;
    phoneNumber: string;
  },
>({ row }: CellContext<T, unknown>) {
  return (
    <div className="">
      <div className="text-md">
        {row.original.firstname} {row.original.lastname}
      </div>
    </div>
  );
}

export function ClientPhoneNumberCell<T extends { phoneNumber: string }>({
  row,
}: CellContext<T, unknown>) {
  return (
    <div className="flex items-center gap-2">
      <PhoneIcon size={12} />
      {row.original.phoneNumber}
    </div>
  );
}

export function ClientEmailCell<T extends { email: string }>({
  row,
}: CellContext<T, unknown>) {
  return (
    <div className="flex items-center gap-2">
      <Mail size={12} />
      {row.original.email}
    </div>
  );
}
