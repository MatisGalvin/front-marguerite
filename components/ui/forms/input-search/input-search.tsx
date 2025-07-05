"use client";

import { ChevronsUpDown, User } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
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
import { useToggle } from "@/hooks/toggle";
import { cn } from "@/lib/utils";

type Option = { value: string | number; label: string };
export function InputSearch({
  options = [],
  ...p
}: {
  readonly?: boolean;
  name: string;
  label: string;
  placeholder: string;
  options?: Option[];
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const form = useFormContext();
  const { isOpen, close, open, setIsOpen } = useToggle(false);

  return (
    <FormField
      control={form.control}
      name={p.name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col">
            <FormLabel>
              <div className="flex gap-2">
                {p.icon}
                {p.label}
                {p.required && <span className={`text-red-400`}>*</span>}
              </div>
            </FormLabel>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger
                asChild
                data-state={isOpen ? "open" : "closed"}
                aria-expanded={isOpen}
              >
                <FormControl>
                  <Button
                    disabled={p.readonly}
                    variant="outline"
                    role="combobox"
                    onClick={open}
                    className={cn(
                      "w-[200px] justify-between",
                      (!field.value || p.readonly) && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? options.find((option) => option.value === field?.value)
                        ?.label
                      : "Selectionner"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder={p.placeholder} />
                  <CommandList>
                    <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value?.toString()}
                          onSelect={() => {
                            if (!p.readonly) {
                              form.setValue(field.name, option.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              });
                              form.trigger(field.name);
                              close();
                            }
                          }}
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
