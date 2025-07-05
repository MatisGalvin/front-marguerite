import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

type DialogConfirmationProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirmButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

/**
 * Dialog used for confirmation (ex: delete user)
 */
export function DialogConfirmation({
  title,
  message,
  onConfirm,
  open,
  setOpen,
  confirmButtonVariant,
}: DialogConfirmationProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {message}
        <DialogFooter>
          <div>
            <Button variant={"secondary"} onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
          <Button
            variant={confirmButtonVariant ?? "default"}
            onClick={onConfirm}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
