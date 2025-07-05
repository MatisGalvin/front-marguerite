import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { InputProps } from "react-day-picker";
import { useFormContext } from "react-hook-form";

type InputTextProps = {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  autoFocus?: boolean;
  required?: boolean;
  icon?: React.ReactNode;

  onChange?: (text: string) => void;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function InputText({
  name,
  label,
  placeholder,
  className,
  required,
  autoFocus,
  onChange,
  icon,
  ...rest
}: InputTextProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className} onChange={onChange}>
          <FormLabel>
            <div className="flex gap-2">
              {icon}
              {label}
              {required && <span className={`text-red-400`}>*</span>}
            </div>
          </FormLabel>
          <FormControl>
            <Input
              min={1}
              placeholder={placeholder}
              {...field}
              autoFocus={autoFocus}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
