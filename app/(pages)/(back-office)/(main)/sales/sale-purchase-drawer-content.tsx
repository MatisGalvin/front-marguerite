import * as React from "react"
import { Minus, PanelBottomClose, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Sale } from "@/types/sale.type"
import { toPrettyDate } from "@/lib/date-utils"
import { PurchaseTable } from "@/features/purchase/purchase-table"
import { SaleCard } from "./sale-card"

export function SalePurchaseDrawerContent(p: { sale?: Sale, onOpenChange: (isOpen: boolean) => void }) {

  if (!p.sale) {
    return null
  }

  return (
    <Drawer open={!!p.sale} onOpenChange={p.onOpenChange}>
      <DrawerContent className="p-0 m-0">
        <div>
          <div className="flex justify-end p-4">
            <X className="cursor-pointer" onClick={() => p.onOpenChange(false)} />
          </div>
          <div className="p-8">
            <SaleCard sale={p.sale} />
            <PurchaseTable purchases={p.sale.purchases} className="h-[40rem] " />
          </div>



        </div>
      </DrawerContent>
    </Drawer >
  )
}