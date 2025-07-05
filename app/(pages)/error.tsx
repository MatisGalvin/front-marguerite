"use client";

import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{"Aouch quelque chose ne s'est pas passé comme prévu"}</h2>
      <Link className="underline" href={ROUTES.dashboard}>
        Rentrer à la maison
      </Link>
    </div>
  );
}
