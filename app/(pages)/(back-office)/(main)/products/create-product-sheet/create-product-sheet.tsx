import { ProductApi } from "@/api/products/product-api";
import { CreateProductBodyParamsRequest } from "@/api/products/product-api.type";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";
import { InputDropdown } from "@/components/ui/forms/input-dropdown/input-dropdown";
import { InputFile } from "@/components/ui/forms/input-file/input-file";
import { InputNumber } from "@/components/ui/forms/input-number/input-number";
import { InputText } from "@/components/ui/forms/input-text/input-text";
import { InputTextarea } from "@/components/ui/forms/input-textarea/input-textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { toast } from "@/hooks/toast";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Barcode, CheckIcon, Plus, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ProductForm,
  ProductFormSchema,
} from "../../../../../../schemas/product-schema";
export function CreateProductSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ProductForm>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 1,
      unit: "kg",
      product_options: "",
    },
  });
  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async (newProduct: FormData) => {
      return ProductApi.create(newProduct);
    },
    onSuccess: (product) => {
      toast({
        title: "",
        description: (
          <div>
            <div className="text-md flex gap-1 font-bold">
              {" "}
              Création de produit{" "}
              <CheckIcon className="absolute right-4" color="green" />
            </div>
            <div className=" mt-2">
              Le produit {product.name} à été créé avec succès
            </div>
          </div>
        ),
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Echec : Création du produit",
        description: "Une erreur est survenue lors de la création du produit.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit({
    image,
    product_options,
    ...formValues
  }: ProductForm) {
    const formData = new FormData();
    const productOptionsArray =
      product_options && product_options?.length > 0
        ? product_options?.split(",")
        : undefined;
    formData.append(
      "data",
      JSON.stringify({ ...formValues, product_options: productOptionsArray }),
    );
    formData.append("files.image", image, image.name);

    createProduct(formData);
  }

  const formFields = (
    <div className="grid gap-4 py-4 ">
      <InputText
        required
        name="name"
        label="Nom"
        placeholder="Nom du produit"
      />
      <InputTextarea
        name="description"
        required
        label="Description"
        placeholder="Description du produit"
        className="h-32"
      />
      <div className="flex gap-4">
        <InputNumber
          step={"1"}
          required
          name="price"
          label="Prix (€)"
          placeholder="Prix du produit"
        />
        <InputDropdown
          readonly
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
        label="Formats (séparées par virgules)"
        placeholder="Ex: 10,20,30"
      />
      <InputFile
        name="image"
        required
        label="Image"
        imageUrl={form.watch("image_url")}
      />
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full justify-end pr-12  ">
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="relative"
            onClick={() => setIsOpen(true)}
          >
            <Barcode className="mr-5 h-5 w-5" />
            <Plus className="w-3s absolute inset-x-7 inset-y-2 h-3 " />
            Créer produit
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <UserPlusIcon className="mr-2 h-4 w-4 " /> Créer un nouveau produit
          </SheetTitle>
          <SheetDescription>
            Saisissez les informations requises pour créer le produit
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
                  onClick={() => setIsOpen(false)}
                >
                  Annuler
                </Button>
              </div>
              <Button type="submit" isLoading={isPending}>
                Enregistrer
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
