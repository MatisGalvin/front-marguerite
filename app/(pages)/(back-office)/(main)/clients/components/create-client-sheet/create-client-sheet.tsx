import { ClientApi } from "@/api/client/client-api";
import { CreateClientBodyParamsRequest } from "@/api/client/client-api.type";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputText } from "@/components/ui/forms/input-text/input-text";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { ClientForm, ClientFormSchema } from "@/schemas/client-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues: ClientForm = {
  firstname: "",
  lastname: "",
  email: "",
  phoneNumber: "",
};

export function CreateClientSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSuccess = () => {
    toastSuccess("Création du client", "Le client a été créé avec succès");
    form.reset();
    setIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const handleError = async (error: any) => {
    try {
      const response = await error.response.json();
      const errorMessage = response?.error?.message || "Erreur inconnue";
      toastError(
        "Échec : Création du client",
        `Une erreur est survenue lors de la création du client. (${errorMessage})`,
      );
    } catch {
      toastError(
        "Échec : Création du client",
        "Une erreur inattendue s'est produite",
      );
    }
  };

  const { mutate: createClient, isPending } = useMutation({
    mutationFn: (newClient: CreateClientBodyParamsRequest) =>
      ClientApi.create(newClient),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const onSubmit = (formData: ClientForm) => createClient(formData);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full justify-end pr-12">
        <SheetTrigger asChild>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <UserPlusIcon className="mr-2 h-5 w-5" />
            Créer client
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Ajouter un nouveau client
          </SheetTitle>
          <SheetDescription>
            Saisissez les informations requises pour créer le client
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <InputText
                required
                name="firstname"
                label="Prénom"
                placeholder="John"
              />
              <InputText
                required
                name="lastname"
                label="Nom"
                placeholder="Doe"
              />
              <InputText
                required
                name="email"
                label="Email"
                type="email"
                placeholder="a@example.com"
              />
              <InputText
                required
                name="phoneNumber"
                label="Numéro de téléphone"
                placeholder="06..."
              />
            </div>

            <SheetFooter>
              <Button
                variant="secondary"
                type="button"
                disabled={isPending}
                onClick={closeSheet}
              >
                Annuler
              </Button>
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
