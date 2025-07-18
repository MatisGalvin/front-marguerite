import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { Textarea } from "../../textarea";
export function InputTextarea(
  p: {
    name: string;
    label: string;
    placeholder: string;
    className?: string;
    formItemProps?: React.HTMLAttributes<HTMLDivElement> &
      React.RefAttributes<HTMLDivElement>;
    onChange?: (text: string) => void;
    required?: boolean;
  } & React.InputHTMLAttributes<HTMLTextAreaElement>,
) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={p.name}
      render={({ field }) => (
        <FormItem {...p.formItemProps}>
          <FormLabel>
            {p.label} {p.required && <span className={`text-red-400`}>*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              className={p.className}
              placeholder={p.placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
