import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cx } from "class-variance-authority";

import { useFormContext } from "react-hook-form";
export type InputOptions = { value: string | number; label: string };
export function InputDropdown({
  options = [],
  ...p
}: {
  name: string;
  label: string;
  placeholder: string;
  options?: InputOptions[];
  className?: string;
  formItemProps?: React.HTMLAttributes<HTMLDivElement> &
    React.RefAttributes<HTMLDivElement>;
  onChange?: (value: string | number) => void;
  required?: boolean;
  icon?: React.ReactNode;
  readonly?: boolean;
}) {
  const form = useFormContext();
  const originalValueType = typeof options[0]?.value;

  return (
    <FormField
      control={form.control}
      name={p.name}
      render={({ field }) => {
        return (
          <FormItem {...p.formItemProps} className={cx("w-full", p.className)}>
            <FormLabel className="!my-0 flex gap-2 !space-y-0 !py-0">
              {p.icon}
              {p.label}
              {p.required && <span className={`text-red-400`}>*</span>}
            </FormLabel>
            <Select
              disabled={p.readonly}
              value={field.value?.toString()}
              defaultValue={field.value?.toString()}
              onValueChange={(v) => {
                const value = originalValueType === "string" ? v : Number(v);
                field.onChange(value);
                p.onChange?.(value);
              }}
            >
              <FormControl>
                <SelectTrigger readonly={p.readonly}>
                  <SelectValue placeholder={p.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={cx("w-full")}>
                {options.map((d, i) => {
                  return (
                    <SelectItem
                      key={d.value + "--" + i}
                      value={d.value.toString()}
                    >
                      {d.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
