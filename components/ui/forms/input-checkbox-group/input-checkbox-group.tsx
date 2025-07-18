"use client";

import { FieldValues, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CheckboxItem = { id: string; label: string };
type InputCheckboxGroupProps = {
  items: CheckboxItem[];
  required?: boolean;
  name: string;
  label: string;
  description?: string;
};

export function InputCheckboxGroup({
  items = [],
  ...p
}: InputCheckboxGroupProps) {
  const form = useFormContext();

  const renderCheckbox = (field: FieldValues, item: CheckboxItem) => (
    <Checkbox
      checked={
        (field.value as CheckboxItem[])?.find(
          (value) => value.id === item.id,
        ) !== undefined
      }
      onCheckedChange={(checked) => {
        return checked
          ? field.onChange([...field.value, { id: item.id, label: item.label }])
          : field.onChange(
              field.value?.filter(
                (value: CheckboxItem) => value.id !== item.id,
              ),
            );
      }}
    />
  );
  return (
    <FormField
      control={form.control}
      name={p.name}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">
              {p.label} {p.required && <span className="text-red-500">*</span>}
            </FormLabel>
            {p.description && (
              <FormDescription>{p.description}</FormDescription>
            )}
          </div>
          {items.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name={p.name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>{renderCheckbox(field, item)}</FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
