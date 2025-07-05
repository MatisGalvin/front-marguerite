import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { cx } from "class-variance-authority";
import React from "react";
import { useFormContext } from "react-hook-form";

type InputNumberProps = {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  formItemProps?: React.HTMLAttributes<HTMLDivElement> &
  React.RefAttributes<HTMLDivElement>;
  required?: boolean;
  onChange?: (value: number) => void;
  icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;
export function InputNumber({
  name,
  label,
  placeholder,
  className,
  formItemProps,
  required,
  onChange,
  icon,
  ...p
}: InputNumberProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ref, ...field } }) => (
        <FormItem className={cx("w-full", className)} {...formItemProps} autoFocus={false}>
          <FormLabel className="flex gap-2">
            {icon}
            {label}
            {required && <span className={`text-red-400`}>*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              autoFocus={false}
              {...field}
              {...p}
              onChange={(e) => {
                let v = e.target.value;

                const valueNumber = v === "" ? null : Number(v);
                if (!onChange) {
                  form.setValue(field.name, valueNumber, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.trigger(field.name);
                } else {
                  onChange(valueNumber);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
