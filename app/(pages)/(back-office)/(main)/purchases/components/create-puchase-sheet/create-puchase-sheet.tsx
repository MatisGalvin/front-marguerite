import { PurchaseApi } from "@/api/purchase/purchase-api";
import { CreatePurchaseBodyParamsRequest } from "@/api/purchase/purchase-api.type";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { useClientsMe, useProductsMe, useSalesMe } from "@/hooks/api";
import { useToast } from "@/hooks/toast";
import { queryClient } from "@/lib/react-query";

import { InputRadioGroup } from "@/components/ui/forms/input-radiogroup/input-radiogroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Calendar,
  CheckIcon,
  PackagePlus,
  Plus,
  Save,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  PurchaseForm,
  PurchaseItemSchema,
  PurchaseSchema,
} from "../../../../../../../schemas/purchase-schema";
import { toPrettyDate } from "@/lib/date-utils";
import { ProductExtra } from "@/types/purchase.type";
import { toastError, toastSuccess } from "@/components/ui/toast";
export function CreatePurchaseSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sales_ = [] } = useSalesMe();
  const sales = sales_.filter((sale) => new Date(sale.endDate) > new Date());

  const { data: products = [] } = useProductsMe();
  const { data: clients = [] } = useClientsMe();
  const { toast } = useToast();

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      clientId: "",
      saleId: "",
      purchaseItems: [
        {
          quantity: 1,
          product: "",
          product_option: undefined,
          product_extra: ProductExtra.CoteDeBoeuf,
        },
      ],
    },
  });
  const { formState } = form;

  const {
    fields,
    append,
    remove,
    update,
    replace: replaceFields,
  } = useFieldArray({
    control: form.control,
    name: "purchaseItems",
  });

  const { mutate: createPurchase, isPending } = useMutation({
    mutationFn: async (purchaseWithItems: CreatePurchaseBodyParamsRequest) =>
      PurchaseApi.create(purchaseWithItems),
    onSuccess: () => {
      setIsOpen(false);
      //we don't invalidate  purchases because there is a socket  doing it

      toastSuccess(
        "Création de commande",
        "La commande à été créée avec succès",
      );
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      form.reset();
    },
    onError: async (error) => {
      const errorMessage = (await (error as any).response.json()).error.message;
      toastError(
        "Echec : Création de la commande",
        "Une erreur est survenue lors de la création de la commande. (" +
          errorMessage +
          ")",
      );
      setIsOpen(false);
      form.reset();
    },
  });

  const selectedSale = sales.find(
    (sale) => sale.id.toString() === form.watch("saleId").toString(),
  );
  const PRODUCT_OPTIONS: InputOptions[] =
    selectedSale?.products?.map(({ name, id }) => ({
      label: name,
      value: id.toString(),
    })) || [];
  // const [availableProductPerField, setAvailableProductPerField] = useState<{
  //   [index: number]: Option[];
  // }>([]);

  const purchaseItems = form.watch("purchaseItems");
  const canAddProducts = purchaseItems.every((f) => {
    return f.product !== "";
  });

  // When the products are loaded, we set the first field with all the products available
  /* useEffect(() => {
    if (products.length > 0) {
      setAvailableProductPerField({
        0:
          products?.map(({ name, id }) => ({
            label: name,
            value: id.toString(),
          })) || [],
      });
    }
  }, [products]);
*/
  function onSubmit(formData: PurchaseForm) {
    createPurchase(formData as CreatePurchaseBodyParamsRequest);
  }

  function addInputs() {
    /* const selectedProductIds: string[] = purchaseItems
      .map((purchaseItem) => purchaseItem.product)
      .filter(Boolean);
    const optionsForNewField = PRODUCT_OPTIONS.filter((option) => {
      const isIdUsed = selectedProductIds.indexOf(option.value) > -1;
      return !isIdUsed;
    });
    const newIndex = selectedProductIds.length;
    setAvailableProductPerField({
      ...availableProductPerField,
      [newIndex]: optionsForNewField,
    });
    */

    append({
      product: "",
      quantity: 1,
      product_option: undefined,
      product_extra: ProductExtra.CoteDeBoeuf,
    });
  }

  const buttonCreate = (
    <div className="absolute right-10">
      <SheetTrigger asChild>
        <Button size="sm">
          <PackagePlus className="mr-2 h-5 w-5" />
          Créer une commande
        </Button>
      </SheetTrigger>
    </div>
  );

  const header = (
    <SheetHeader>
      <SheetTitle className="flex items-center gap-2">
        <PackagePlus size={16} /> Créer une nouvelle commande
      </SheetTitle>
      <SheetDescription>
        Ajoutez des produits pour créer une commande
      </SheetDescription>
    </SheetHeader>
  );

  const renderSearchClientSearch = () => {
    return (
      <InputSearch
        icon={<User size={16} />}
        name="clientId"
        label="Client"
        required
        placeholder="Rechercher un client"
        options={clients.map((client) => ({
          label: `${client.firstname} ${client.lastname}`,
          value: client.id,
        }))}
      />
    );
  };
  const renderSalesDropdown = () => {
    return (
      <InputDropdown
        icon={<Calendar size={16} />}
        className="mb-4 w-[24rem] "
        name={`saleId`}
        required
        placeholder="Selectionnez une période de vente"
        options={sales?.map(({ name, id, startDate, endDate }) => ({
          label:
            name +
            " (" +
            toPrettyDate(startDate) +
            " au " +
            toPrettyDate(endDate) +
            ")",
          value: id,
        }))}
        label={"Période de vente"}
        onChange={() => replaceFields([])}
      />
    );
  };

  // const updateAvailableProductPerFields = (fieldIndex: number) => (selectedValue: string) => {
  //   const selectedProductIds: string[] = purchaseItems
  //     .map((purchaseItem) => purchaseItem.product)
  //     .filter((purch) => purch !== "");
  //   let newOptions: Record<number, Option[]> = {};
  //   for (const key in availableProductPerField) {
  //     if (Number(key) !== fieldIndex) {
  //       const optionsForNewField: Option[] = PRODUCT_OPTIONS.filter((option) => {
  //         const isIdTaken =
  //           selectedProductIds
  //             .filter((pId) => {
  //               return pId !== purchaseItems[Number(key)]?.product;
  //             })
  //             .indexOf(option.value) > -1;

  //         return !isIdTaken;
  //       });

  //       newOptions[Number(key)] = optionsForNewField;
  //     }
  //   }
  //   setAvailableProductPerField({
  //     ...availableProductPerField,
  //     ...newOptions,
  //   });
  // };

  const removeItem = (fieldIndex: number) => {
    // const optionBeingRemoved = purchaseItems[fieldIndex].product;
    // const relatedProductOptionBeingRemoved = PRODUCT_OPTIONS.find(
    //   (prodOption) => prodOption.value !== "" && prodOption.value === optionBeingRemoved
    // );

    // let newOptions: Record<number, Option[]> = {};

    // Object.keys(availableProductPerField).forEach((indexAvailableProductForField) => {
    //   const k = Number(indexAvailableProductForField);
    //   if (relatedProductOptionBeingRemoved && relatedProductOptionBeingRemoved?.value !== "") {
    //     if (k < fieldIndex) {
    //       newOptions[k] = [...availableProductPerField[k], relatedProductOptionBeingRemoved];
    //     } else if (k === fieldIndex) {
    //       if (k == purchaseItems.length - 1) {
    //         newOptions[k] = [];
    //       } else {
    //         if (purchaseItems[k + 1].product === "") {
    //           newOptions[k] = [...availableProductPerField[k]];
    //         } else {
    //           newOptions[k] = [...availableProductPerField[k], ...availableProductPerField[k + 1]];
    //         }
    //       }
    //     }
    //   }
    // });

    remove(fieldIndex);
    // if (Object.keys(newOptions).length > 0) {
    //   setAvailableProductPerField(newOptions);
    // }
  };

  const setDefaultOptionsForPurchaseItem = (
    field: typeof PurchaseItemSchema._type,
    fieldIndex: number,
  ) => {
    const relatedProduct = products.find(
      (prod) => prod.id.toString() === field.product,
    );
    const relatedOptions = relatedProduct?.product_options;
    //set the default option
    if (relatedOptions && relatedOptions.length > 0) {
      update(fieldIndex, {
        product: field.product,
        quantity: field.quantity,
        product_option: relatedOptions[0],
        product_extra: field.product_extra,
      });
    }
  };

  const renderPurchaseItemsInputs = () => {
    return purchaseItems.map((_field, fieldIndex) => {
      const fieldRootKey = `purchaseItems.${fieldIndex}`;
      const relatedProduct = products.find(
        (prod) => prod.id.toString() === purchaseItems[fieldIndex].product,
      );
      const relatedOptions = relatedProduct?.product_options;
      return (
        <div
          key={`purchaseItems.${fields[fieldIndex].id}.${fieldIndex}`}
          className="flex"
        >
          <div className="my-8 space-y-4 ">
            <div className="flex space-x-4 ">
              <InputDropdown
                required
                className="w-[17rem] "
                name={`${fieldRootKey}.product`}
                placeholder="Selectionnez un produit"
                options={PRODUCT_OPTIONS}
                label={"Produit " + (fieldIndex + 1)}
                onChange={() => {
                  setDefaultOptionsForPurchaseItem(_field, fieldIndex);
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
              <div className="flex justify-between">
                <InputRadioGroup
                  className="flex-col"
                  label="Format"
                  name={`${fieldRootKey}.product_option`}
                  options={relatedOptions?.map((opt) => ({
                    value: opt.toString(),
                    label: opt + " " + relatedProduct.unit,
                  }))}
                />

                <InputRadioGroup
                  className="flex-col"
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
          {fields.length > 1 && (
            <Button
              variant={"ghost"}
              className="ml-2 mt-14"
              onClick={() => {
                removeItem(fieldIndex);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    });
  };

  const footer = (
    <SheetFooter className="fixed bottom-10 right-10 ">
      <Button
        type="submit"
        disabled={!formState.isValid || fields.length === 0}
        isLoading={isPending}
      >
        <Save className="mr-2" />
        Enregistrer commande
      </Button>
    </SheetFooter>
  );
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {buttonCreate}
      <SheetContent
        className="w-full md:max-w-[550px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {header}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-[85%] flex-col gap-4 overflow-y-auto p-1 pb-16"
          >
            {renderSearchClientSearch()}
            {renderSalesDropdown()}
            {selectedSale && (
              <div>
                <Separator className=" w-44" />
                {renderPurchaseItemsInputs()}
                {canAddProducts && (
                  <Button
                    className="mt-8"
                    variant={"outline"}
                    onClick={addInputs}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                )}
              </div>
            )}
            {footer}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
