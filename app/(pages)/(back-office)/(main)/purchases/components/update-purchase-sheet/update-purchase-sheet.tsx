import { PurchaseApi } from "@/api/purchase/purchase-api";
import { UpdatePurchaseRequest } from "@/api/purchase/purchase-api.type";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";
import {
  InputDropdown,
  InputOptions,
} from "@/components/ui/forms/input-dropdown/input-dropdown";
import { InputNumber } from "@/components/ui/forms/input-number/input-number";
import { InputSearch } from "@/components/ui/forms/input-search/input-search";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClientsMe, useProductsMe, useSalesMe } from "@/hooks/api";
import { useToast } from "@/hooks/toast";
import { queryClient } from "@/lib/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputRadioGroup } from "@/components/ui/forms/input-radiogroup/input-radiogroup";
import { ProductExtra, Purchase } from "@/types/purchase.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, PackagePlus, Save } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  PurchaseForm,
  PurchaseSchema,
} from "../../../../../../../schemas/purchase-schema";
import { toastError, toastSuccess } from "@/components/ui/toast";

export function UpdatePurchaseSheet(p: {
  purchase: Purchase;
  isOpen: boolean;
  onOpenChange: (show: boolean) => void;
}) {
  const { data: sales_ = [] } = useSalesMe();
  const sales = sales_.filter((sale) => new Date(sale.endDate) > new Date());
  const { data: products = [] } = useProductsMe();
  const { data: clients = [] } = useClientsMe();
  const { toast } = useToast();

  const PRODUCT_OPTIONS: InputOptions[] = products?.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }));

  const CLIENT_OPTIONS = clients.map((client) => ({
    label: `${client.firstname} ${client.lastname}`,
    value: client.id,
  }));

  const SALES_OPTIONS = sales?.map(({ name, id }) => ({
    label: name,
    value: id.toString(),
  }));

  const DEFAULT_VALUES = {
    clientId: p.purchase.client.id,
    saleId: p.purchase.sale.id,
    purchaseItems: p.purchase.purchase_items.map((purchase_item) => ({
      id: purchase_item.id.toString(),
      product: purchase_item.product.id.toString(),
      quantity: purchase_item.quantity,
      product_option: purchase_item.product_option.toString(),
      product_extra: purchase_item.product_extra,
    })),
  };

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    control,
    formState: { isValid },
    watch,
  } = form;
  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "purchaseItems",
  });

  useEffect(() => {
    if (p.isOpen === false) {
      form.reset();
    } else {
      replace(DEFAULT_VALUES.purchaseItems);
    }
  }, [p.isOpen]);
  const { mutate: updatePurchase, isPending } = useMutation({
    mutationFn: async (purchaseWithItems: UpdatePurchaseRequest) =>
      PurchaseApi.update(p.purchase.id, purchaseWithItems),
    onSuccess: () => {
      toastSuccess(
        "Modification de la commande",
        "La commande à été mise à jour avec succès",
      );
      p.onOpenChange(false);
      form.reset();
    },
    onError: (err) => {
      toastError(
        "Echec : Modification de la commande",
        "Une erreur est survenue lors de la modification de la commande.",
      );
      p.onOpenChange(false);
      form.reset();
    },
  });

  const purchaseItems = watch("purchaseItems");

  function onSubmit() {
    const formData = form.getValues();
    updatePurchase(formData);
  }

  const header = (
    <SheetHeader>
      <SheetTitle className="flex items-center">
        <PackagePlus className="mr-2 h-4 w-4 " /> Modifier une commande
      </SheetTitle>
      <SheetDescription>
        Ajoutez ou modifiez produits sur cette commande
      </SheetDescription>
    </SheetHeader>
  );

  const renderSearchClientSearch = () => {
    return (
      <InputSearch
        readonly
        name="clientId"
        label="Client"
        placeholder="Rechercher un client"
        options={CLIENT_OPTIONS}
      />
    );
  };
  const renderSalesDropdown = () => {
    return (
      <InputDropdown
        readonly
        className="mb-4 w-[24rem] "
        name={"saleId"}
        placeholder="Selectionnez une période de vente"
        options={SALES_OPTIONS}
        label={"Période de vente"}
      />
    );
  };

  const renderPurchaseItemsDropdown = () => {
    return purchaseItems.map((_field, fieldIndex) => {
      const fieldRootKey = `purchaseItems.${fieldIndex}`;
      const relatedProduct = products.find(
        (prod) => prod.id.toString() === purchaseItems[fieldIndex].product,
      );
      const relatedOptions = relatedProduct?.product_options;
      return (
        <div
          key={`purchaseItems.${fields[fieldIndex].id}.${fieldIndex}`}
          className="flex  "
        >
          <div className="my-8  w-full space-y-4">
            <div className="flex space-x-4">
              <InputDropdown
                required
                name={`${fieldRootKey}.product`}
                placeholder="Selectionnez un produit"
                options={PRODUCT_OPTIONS}
                label={"Produit " + (fieldIndex + 1)}
                onChange={(prodId) => {
                  const relatedProduct = products.find(
                    (prod) => prod.id.toString() === prodId,
                  );

                  const relatedOptions = relatedProduct?.product_options;
                  if (relatedOptions) {
                    update(fieldIndex, {
                      ..._field,
                      product_option: relatedOptions?.[0].toString(),
                    });
                  }
                }}
              />
              <InputNumber
                className="w-24"
                name={`${fieldRootKey}.quantity`}
                placeholder="ex: 1"
                label="Quantité"
              />
            </div>

            {relatedOptions && relatedOptions.length > 0 && (
              <div className="flex flex-col gap-8">
                <InputRadioGroup
                  label="Format"
                  name={`${fieldRootKey}.product_option`}
                  options={relatedOptions?.map((opt) => ({
                    value: opt.toString(),
                    label: opt + " " + relatedProduct.unit,
                  }))}
                />
                <InputRadioGroup
                  className="flex "
                  label="Option"
                  name={`${fieldRootKey}.product_extra`}
                  options={Object.values(ProductExtra).map((productExtra) => ({
                    value: productExtra,
                    label: productExtra,
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const footer = (
    <SheetFooter className="fixed bottom-10 right-10 ">
      <Button type="submit" disabled={!isValid} isLoading={isPending}>
        <Save className="mr-2" />
        Sauvegarder modifications
      </Button>
    </SheetFooter>
  );
  return (
    <Sheet open={p.isOpen} onOpenChange={p.onOpenChange}>
      <SheetContent
        className="w-[640px] md:max-w-[640px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {header}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-[85%] flex-col gap-4 overflow-y-auto p-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générale</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {renderSearchClientSearch()}
                {renderSalesDropdown()}
              </CardContent>
            </Card>

            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modifier produits</CardTitle>
                <CardDescription>
                  Modifier les produits, quantités et/ou options
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 ">
                {renderPurchaseItemsDropdown()}
              </CardContent>
            </Card>

            {footer}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
