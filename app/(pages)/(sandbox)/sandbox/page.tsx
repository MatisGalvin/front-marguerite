"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function SandboxPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>HELLO

        
      </Button>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </main>
  );
}
