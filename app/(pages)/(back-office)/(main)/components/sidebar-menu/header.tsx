import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe } from "@/hooks/api";
import { useAuthContext } from "@/hooks/auth";
import { UserIcon } from "lucide-react";

export function Header() {
  const { data: user } = useMe();

  const auth = useAuthContext();
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-gray-100/40 px-6 lg:h-[60px] lg:justify-end ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full items-center justify-end">
            <div className="pr-2">
              Bonjour {user?.username.split(" ")[0]} 👋
            </div>
            <Button
              className="h-8 w-8 rounded-full border border-gray-200 "
              size="icon"
              variant="ghost"
            >
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu profil</span>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={auth.signOut}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
