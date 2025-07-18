import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { cx } from "class-variance-authority";
import Image from "next/image";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
export function InputFile({
  accept = ".jpg,.png,image/jpeg,image/png",
  ...p
}: {
  name: string;
  label: string;
  className?: string;
  formItemProps?: React.HTMLAttributes<HTMLDivElement> &
    React.RefAttributes<HTMLDivElement>;
  accept?: string;
  required?: boolean;
  imageUrl?: string;
}) {
  const form = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <FormField
      control={form.control}
      name={p.name}
      render={({ field: { value, onChange, ...field } }) => {
        const previewImageSrc = value ? URL.createObjectURL(value) : p.imageUrl;

        return (
          <FormItem className={p.className} {...p.formItemProps}>
            <FormLabel htmlFor="picture">
              {p.label}
              {p.required && <span className={`text-red-400`}>*</span>}
            </FormLabel>

            {previewImageSrc && (
              <>
                <div className={`group relative cursor-pointer`}>
                  <Image
                    src={previewImageSrc}
                    alt="Image Description"
                    width={400}
                    height={400}
                    className="rounded-md"
                    onClick={() => inputRef.current?.click()}
                  />
                  <div className=" pointer-events-none absolute inset-0 hidden items-center justify-center   rounded-md bg-black/50   text-white group-hover:flex ">
                    Selectionner une image
                  </div>
                </div>
              </>
            )}
            <FormControl>
              <Input
                id="picture"
                type="file"
                accept={accept}
                className={cx(value || previewImageSrc ? "hidden" : "block")}
                {...field}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    form.setValue(p.name, file, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    form.trigger(p.name);
                  }
                }}
                ref={inputRef}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
