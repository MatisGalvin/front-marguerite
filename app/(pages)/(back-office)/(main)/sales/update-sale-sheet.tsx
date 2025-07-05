import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/react-query";
import { SaleAPI } from "@/api/sale/sale-api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputText } from "@/components/ui/forms/input-text/input-text";
import { InputNumber } from "@/components/ui/forms/input-number/input-number";
import { CheckIcon, Save, UserCog } from "lucide-react";
import { UpdateSaleForm, UpdateSaleFormSchema } from "@/schemas/sale-schema";
import { InputDateRange } from "@/components/ui/forms/input-date-range/input-date-range";
import { InputCheckboxGroup } from "@/components/ui/forms/input-checkbox-group/input-checkbox-group";
import { useProductsMe } from "@/hooks/api";
import { Sale } from "@/types/sale.type";
import { toastError, toastSuccess } from "@/components/ui/toast";

export function UpdateSaleSheet(p: {
  sale: Sale;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const products = useProductsMe();


  const sale = p.sale

  const form = useForm<UpdateSaleForm>({
    resolver: zodResolver(UpdateSaleFormSchema),
    defaultValues: {
      name: sale.name,
      max_weight: sale.max_weight,
      date: {
        from: new Date(sale.startDate),
        to: new Date(sale.endDate),
      },
      products: sale.products.map(product => ({ id: product.id.toString() })),
    },
    mode: "onChange",
  })

  const { mutate: updateSale, isPending } = useMutation({
    mutationFn: async (formValues: UpdateSaleForm) => SaleAPI.update(sale.id, formValues),
    onSuccess: (sale) => {

      toastSuccess("Modification de la vente", `La vente ${sale.name} à été modifiée avec succès`)
      form.reset();
      p.onOpenChange(false);
    },
    onError: async (error) => {
      const errorMessage = (await (error as any).response.json()).error.message;
      toastError("Echec : Modification de la vente", errorMessage)
    },
  });

  async function onSubmit(formValues: UpdateSaleForm) {
    updateSale(formValues);
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
    <Sheet open={p.isOpen} onOpenChange={p.onOpenChange} >
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <UserCog className="h-4 w-4 mr-2" /> Modifier une vente existante
          </SheetTitle>
          <SheetDescription>
            Saisissez les informations requises pour modifier la vente
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