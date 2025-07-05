"use client";

import { SaleAPI } from "@/api/sale/sale-api";
import { Sale } from "@/types/sale.type";
import { useQuery } from "@tanstack/react-query";
import { ArrowBigLeftDash, ArrowBigRightDash, ArrowDownToDot, Calendar, StepBack, StepForwardIcon, } from "lucide-react";
import { CreateSaleSheet } from "./create-sale-sheet";
import { UpdateSaleSheet } from "./update-sale-sheet";
import { useEffect, useState } from "react";
import { SalePurchaseDrawerContent } from "./sale-purchase-drawer-content";
import { SaleCard } from "./sale-card";

export default function Sales() {
  const [selectedSaleToEdit, setSelectedSaleToEdit] = useState<Sale>()
  const [selectedSaleToDetail, setSelectedSaleToDetail] = useState<Sale>()
  const { data: sales } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: () => SaleAPI.readAll(),
  });

  // As soon as a change occurs in the sales, if the detail is open we update the selected sale to detail to be the latest version
  useEffect(() => {

    if (selectedSaleToDetail) {
      const sale = sales?.find((sale: Sale) => sale.id === selectedSaleToDetail.id)
      if (sale) {
        setSelectedSaleToDetail(sale)
      }
    }
  }, [sales])
  const pastSales = sales
    ?.filter((sale: Sale) => new Date(sale.endDate) < new Date())
    .map((sale: Sale) => (
      <div key={sale.id} className="py-2">
        <SaleCard sale={sale} onClickEdit={setSelectedSaleToEdit} onClickDetail={setSelectedSaleToDetail} isDisabled />
      </div>
    ))


  const presentSales = sales
    ?.filter((sale: Sale) => new Date(sale.startDate) <= new Date() && new Date(sale.endDate) >= new Date())
    .map((sale: Sale) => (
      <div key={sale.id} className="py-2">
        <SaleCard sale={sale} onClickEdit={setSelectedSaleToEdit} onClickDetail={setSelectedSaleToDetail} />
      </div>
    ))

  const futurSales = sales
    ?.filter((sale: Sale) => new Date(sale.startDate) > new Date())
    .map((sale: Sale) => (
      <div key={sale.id} className="py-2">
        <SaleCard sale={sale} onClickEdit={setSelectedSaleToEdit} onClickDetail={setSelectedSaleToDetail} />
      </div>
    ))

  return (
    <div>
      <h1 className="flex gap-2 items-center">
        <Calendar size={25} />
        Mes ventes
      </h1>
      <CreateSaleSheet />
      {selectedSaleToEdit && <UpdateSaleSheet isOpen={!!selectedSaleToEdit} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedSaleToEdit(undefined)
        }
      }} sale={selectedSaleToEdit} />}

      {/* PRESENT SALES */}
      <div className="p-4">
        <h2 className="flex items-center pb-2">
          <ArrowDownToDot className="mr-2" /> Vente en cours
        </h2>
        {presentSales && presentSales?.length > 0 ? presentSales : "-"}
      </div>
      <div className="p-4">
        <h2 className="flex items-center pb-2">
          <StepForwardIcon className="mr-2" /> Mes prochaines ventes
        </h2>
        {futurSales && futurSales?.length > 0 ? futurSales : "-"}
      </div>

      {/* PAST SALES */}
      <div className="p-4">
        <h2 className="flex items-center pb-2 text-gray-400">
          <StepBack className="mr-2" /> Mes ventes passées
        </h2>
        {pastSales && pastSales?.length > 0 ? pastSales : "-"}
      </div>

      <SalePurchaseDrawerContent sale={selectedSaleToDetail} onOpenChange={(isOpen: boolean) => {
        if (!isOpen) {
          setSelectedSaleToDetail(undefined)
        }
      }} />
    </div>
  );
}
