"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cx } from "class-variance-authority";
import { InputOptions } from "../input-dropdown/input-dropdown";

export function InputRadioGroup(p: {
  label: string;
  name: string;
  options: InputOptions[];
  className?: string;
}) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={p.name}
      render={({ field }) => (
        <FormItem className="flex flex-col ">
          <FormLabel>{p.label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value.toString()}
              className={cx("flex gap-6 pt-2", p.className)}
            >
              {p.options.map((option) => (
                <FormItem
                  key={option.value}
                  className={cx(
                    "group flex items-center space-x-1  space-y-0  ",
                  )}
                  onClick={() => {
                    field.onChange(option.value);
                  }}
                >
                  <FormControl>
                    <RadioGroupItem value={option.value.toString()} />
                  </FormControl>
                  <FormLabel className="font-medium group-hover:cursor-pointer group-hover:text-primary  ">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
