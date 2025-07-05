"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { queryClient } from "@/lib/react-query";
import { Alert } from "../ui/alert-dialog";
import { ClickToComponent } from "click-to-react-component";
export function Providers(p: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Alert />
        {process.env.NODE_ENV === "development" && (
          <ClickToComponent editor="cursor" />
        )}
        {p.children}
      </TooltipProvider>
      {true && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
