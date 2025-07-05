import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ProductApi } from "@/api/products/product-api";
import { InputDropdown } from "@/components/ui/forms/input-dropdown/input-dropdown";
import { InputFile } from "@/components/ui/forms/input-file/input-file";
import { InputNumber } from "@/components/ui/forms/input-number/input-number";
import { InputText } from "@/components/ui/forms/input-text/input-text";
import { InputTextarea } from "@/components/ui/forms/input-textarea/input-textarea";
import { toast } from "@/hooks/toast";
import { queryClient } from "@/lib/react-query";
import { Product } from "@/types/product.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateProductForm, UpdateProductFormSchema } from "../../../../../../schemas/product-schema";

export function UpdateProductSheet(p: {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<UpdateProductForm>({
    resolver: zodResolver(UpdateProductFormSchema),
    defaultValues: {
      name: p.product.name,
      description: p.product.description,
      price: p.product.price,
      unit: p.product.unit,
      product_options: p.product.product_options?.join(",") ?? undefined,
      image_url: p.product.image.url,
      image: undefined,
    },
    mode: "onChange",
  });

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      ProductApi.update(p.product.id, formData),
    onSuccess: (product) => {

      toast({
        title: "",
        description: <div >
          <div className="flex gap-1 text-md font-bold">  Modification du produit  <CheckIcon className="absolute right-4" color="green" /></div>
          <div className=" mt-2">
            Le produit ${product.name} à été modifié avec succès
          </div>
        </div>
      });
      p.onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Echec : Modification du produit",
        description:
          "Une erreur est survenue lors de la modification du produit.",
      });
    },
  });

  async function onSubmit({
    image,
    product_options,
    ...formValues
  }: UpdateProductForm) {
    const formData = new FormData();
    const productOptionsArray =
      product_options && product_options?.length > 0
        ? product_options?.split(",")
        : undefined;
    formData.append(
      "data",
      JSON.stringify({ ...formValues, product_options: productOptionsArray })
    );
    if (image) {
      formData.append("files.image", image, image.name);
    }
    if (Object.keys(form.formState.dirtyFields).length > 0 || image) {
      updateProduct(formData);
    } else {
      p.onOpenChange(false);
    }
  }

  const formFields = (
    <div className="grid gap-4 py-4">
      <InputText name="name" label="Nom" placeholder="Nom du produit" />
      <InputTextarea
        name="description"
        label="Description"
        placeholder="Description du produit"
        className="h-32"
      />
      <div className="flex gap-4">
        <InputNumber
          step={"1"}
          name="price"
          label="Prix (€)"
          placeholder="Prix du produit"
        />
        <InputDropdown
          name="unit"
          label="Unité"
          placeholder="Unité"
          options={[
            { value: "kg", label: "Le kg" },
            { value: "quantity", label: "L'unité" },
          ]}
        />
      </div>
      <InputText
        name="product_options"
        label="Format (séparées par virgules)"
        placeholder="Ex: 10,20,30"
      />
      <InputFile
        name="image"
        label="Image"
        imageUrl={form.watch("image_url")}
      />
    </div>
  );
  return (
    <Sheet open={p.isOpen} onOpenChange={p.onOpenChange}>
      <SheetContent className="overflow-y-scroll h-screen" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className="flex gap-2 ">
            <UserCog className="h-5 w-5 pt-1" /> Modifier un produit existant
          </SheetTitle>
          <SheetDescription>
            Saisissez les informations requises pour modifier le produit
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            {formFields}
            <SheetFooter>
              <div>
                <Button
                  variant={"secondary"}
                  type="button"
                  disabled={isPending}
                  onClick={() => p.onOpenChange(false)}
                >
                  Annuler
                </Button>
              </div>
              <Button
                type="submit"
                isLoading={isPending}
                disabled={!form.formState.isValid}
              >
                Enregistrer
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
