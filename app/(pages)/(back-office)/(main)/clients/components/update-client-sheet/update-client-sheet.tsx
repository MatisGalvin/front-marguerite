import { ClientApi } from "@/api/client/client-api";
import { UpdateClientRequest } from "@/api/client/client-api.type";
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
} from "@/components/ui/sheet";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { ClientForm, ClientFormSchema } from "@/schemas/client-schema";
import { Client } from "@/types/client.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
import { useForm } from "react-hook-form";

interface UpdateClientSheetProps {
  client: Client;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateClientSheet({
  client,
  isOpen,
  onOpenChange,
}: UpdateClientSheetProps) {
  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: client,
    mode: "onChange",
  });

  const handleSuccess = () => {
    toastSuccess(
      "Modification du client",
      "Le client a été modifié avec succès",
    );
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    form.reset();
  };

  const handleError = () => {
    toastError(
      "Échec : Modification du client",
      "Une erreur est survenue lors de la modification du client.",
    );
  };

  const { mutate: updateClient, isPending } = useMutation({
    mutationFn: (clientData: UpdateClientRequest) =>
      ClientApi.update(clientData),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const onSubmit = (formData: ClientForm) => {
    const updatedClient = { id: client.id, ...formData };

    if (Object.keys(form.formState.dirtyFields).length > 0) {
      updateClient(updatedClient);
    } else {
      onOpenChange(false);
      form.reset();
    }
  };

  const closeSheet = () => onOpenChange(false);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex gap-2">
            <UserCog className="h-5 w-5 pt-1" />
            Modifier un client existant
          </SheetTitle>
          <SheetDescription>
            Saisissez les informations requises pour modifier le client
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
