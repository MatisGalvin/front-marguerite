import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/react-query";
import { SaleAPI } from "@/api/sale/sale-api";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputText } from "@/components/ui/forms/input-text/input-text";
import { InputNumber } from "@/components/ui/forms/input-number/input-number";
import { CheckIcon, Plus, Save, ShoppingCart, UserPlus2Icon } from "lucide-react";
import { CreateSaleForm, CreateSaleFormSchema } from "@/schemas/sale-schema";
import { InputDateRange } from "@/components/ui/forms/input-date-range/input-date-range";
import { InputCheckboxGroup } from "@/components/ui/forms/input-checkbox-group/input-checkbox-group";
import { useProductsMe } from "@/hooks/api";

export function CreateSaleSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const products = useProductsMe();
  const form = useForm<CreateSaleForm>({
    resolver: zodResolver(CreateSaleFormSchema),
    defaultValues: {
      date: {
        from: undefined,
        to: undefined
      },
      products: [],
    },
  });
  const { mutate: createSale, isPending } = useMutation({

    mutationFn: async (formValues: CreateSaleForm) => SaleAPI.create(formValues),
    onSuccess: (sale) => {

      toast({
        title: "",
        description: <div >
          <div className="flex gap-1 text-md font-bold">Création vente  <CheckIcon className="absolute right-4" color="green" /></div>
          <div className=" mt-2">
            La vente {sale.name} à été créée avec succès
          </div>
        </div>
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Echec : Création de la vente",
        description: "Une erreur est survenue lors de la création de la vente.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(formValues: CreateSaleForm) {
    createSale(formValues);
  }

  const formFields = (
    <div className="grid gap-8 py-4">
      <InputText
        required
        name="name"
        label="Nom"
        placeholder="Nom de la vente"
      />
      <InputNumber
        required
        name="max_weight"
        label="Poids maximum (kg)"
        placeholder="Poids maximum"
      />
      <InputDateRange
        required
        name="date"
        label="Période de vente"
        labelNoDateSelected="Selectionnez une période"
      />

      <InputCheckboxGroup
        name="products"
        label="Produits"
        items={products.data?.map((product) => ({ id: product.id.toString(), label: product.name })) ?? []}
      />

    </div>
  );


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full justify-end pr-12">
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 mr-5" />
            <Plus className="h-3 w-3 absolute inset-x-7 inset-y-2" />
            Créer vente
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <UserPlus2Icon className="h-4 w-4 mr-2" /> Créer une nouvelle vente
          </SheetTitle>
          <SheetDescription>
            Saisissez les informations requises pour créer la vente
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formFields}
            <SheetFooter>

              <Button type="submit" isLoading={isPending}>
                <Save className="h-4 w-4 mr-2" /> Enregistrer
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}