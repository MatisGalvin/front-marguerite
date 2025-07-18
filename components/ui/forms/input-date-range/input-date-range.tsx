"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { FieldError, FieldErrors, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/date-utils";

export function InputDateRange(p: {
  name: string;
  label: string;
  required?: boolean;
  labelNoDateSelected?: string;
}) {
  const form = useFormContext();
  const renderError = () => {
    const errors = form.formState.errors[p.name] as FieldErrors<any>;
    if (errors) {
      const keys = Object.keys(errors);
      const message1 = errors?.[keys?.[0]]?.message as string;
      const message2 = errors?.[keys?.[1]]?.message as string;

      return (
        <div className="text-xs font-medium text-destructive">
          {message1 && <div>{errors?.[keys?.[0]]?.message as string}</div>}
          {message2 && <div>{errors?.[keys?.[1]]?.message as string}</div>}
        </div>
      );
    }
  };
  return (
    <FormField
      control={form.control}
      name={p.name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {p.label} {p.required && <span className={`text-red-400`}>*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value.from ? (
                  field.value.to ? (
                    <>
                      {formatDate(field.value.from)} -{" "}
                      {formatDate(field.value.to)}
                    </>
                  ) : (
                    format(field.value.from, "LLL dd, y", { locale: fr })
                  )
                ) : (
                  <span>{p.labelNoDateSelected}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                classNames={{
                  day_today: "border-2 border-primary text-primary",
                }}
                showOutsideDays={false}
                initialFocus
                mode="range"
                defaultMonth={field.value.from}
                selected={{ from: field.value.from!, to: field.value.to }}
                onSelect={field.onChange}
                locale={fr}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {renderError()}
        </FormItem>
      )}
    />
  );
}
