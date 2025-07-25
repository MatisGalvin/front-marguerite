"use client";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.sales);
  }, [router]);
  return <div></div>;
}
