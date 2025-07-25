"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuthContext } from "@/hooks/auth";
import { toast } from "@/hooks/toast";
import { api } from "@/lib/ky";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Champ requis"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

type LoginResponse = {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export default function SignIn() {
  const router = useRouter();
  const auth = useAuthContext();
  const [displayPassword, setDisplayPassword] = useState(false);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { formState } = form;

  // AUTHENTICATION SIGN IN
  const { mutate: signin, isPending } = useMutation({
    mutationFn: async (formData: LoginFormInputs): Promise<LoginResponse> => {
      return await api
        .post("auth/local", {
          json: {
            identifier: formData.email,
            password: formData.password,
          },
        })
        .json();
    },
    onSuccess: (result: LoginResponse) => {
      auth.signIn(result);
      toast({
        title: "Bonjour " + result.user.username + ",",
        description: "Vous vous êtes connecté avec succès!",
      });
      router.push(ROUTES.dashboard);
    },
    onError: (error) => {
      toast({
        title: "Echec : Connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(formData: LoginFormInputs) {
    signin(formData);
  }

  const PasswordIcon = displayPassword ? FaEye : FaEyeSlash;
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Bonjour 👋</h1>
        <p className="text-sm text-muted-foreground">
          Entrez vos identifiants pour vous connecter
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="name@gmail.com" {...field} />
                  {formState.errors.email && <FormMessage />}
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <div className="relative flex items-center py-4">
                    <Input
                      placeholder="******"
                      {...field}
                      type={displayPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      data-testid="toggle-password-visibility"
                      onClick={() => setDisplayPassword(!displayPassword)}
                    >
                      <PasswordIcon className="relative right-7" />
                    </button>
                  </div>

                  {formState.errors.password && <FormMessage />}
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-1">
            <Button disabled={isPending}>
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Se connecter
            </Button>
          </div>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        En cliquant, vous acceptez nos{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Conditions d&apos;utilisation
        </Link>{" "}
        et{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Politique de confidentialité
        </Link>
        .
      </p>
    </div>
  );
}
