import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Sale } from "@/types/sale.type";
import { cx } from "class-variance-authority";
import { BanknoteIcon, MoreVertical, Pencil, WeightIcon } from "lucide-react";

export function SaleCard(p: { sale: Sale, onClickEdit?: (sale: Sale) => void, onClickDetail?: (sale: Sale) => void, isDisabled?: boolean }) {
    const displayDateDay = (startDate: string, endDate: string) => {
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);
        return formattedStartDate.getDate() + "-" + formattedEndDate.getDate();
    };

    console.log('***', p.sale)

    const renderDropdownMenu = () => {
        return <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    onClick={(e) => {
                        p.onClickEdit?.(p.sale)
                        e.stopPropagation()
                    }}
                >
                    <Pencil className="h-4 w-4" />
                    Modifier
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
    return <Card className={cx("group cursor-pointer p-2 relative", p.isDisabled && "opacity-70")} onClick={() => p.onClickDetail?.(p.sale)}>
        {p.onClickEdit && <div className="right-2 absolute">
            {renderDropdownMenu()}
        </div>}
        <div className="flex p-2 group-hover:bg-accent transition-colors duration-300 ease-in-out">
            <div className="flex-center flex-col w-32 p-2 px-4 border rounded-xl min-w-20 group-hover:bg-white transition-colors duration-300 ease-in-out">
                <h2 className="flex justify-center">
                    {displayDateDay(p.sale.startDate, p.sale.endDate)}
                </h2>
                <h3 className={cx("flex justify-center ")}>
                    {new Date(p.sale.startDate)
                        .toLocaleString("fr-FR", { month: "short" })
                        .toUpperCase()}
                </h3>
            </div>
            <div className="flex flex-col p-2 px-4 w-full justify-between gap-2">
                <div className="flex ">
                    <h3>{p.sale.name}</h3>

                </div>
                <div className="flex justify-end">
                    <div>
                        <div className="flex gap-2 font-semibold text-primary"><BanknoteIcon /> Montant des commandes : {p.sale.total_price} €</div>
                        <div className="flex"><span className="font-semibold text-primary flex gap-2 mr-1"><WeightIcon />{p.sale.current_weight ?? "0"} kg </span> / {p.sale.max_weight} kg</div>
                    </div>
                </div>
                <div>
                    <Progress

                        value={p.sale.current_weight / p.sale.max_weight * 100}
                        className={cx("group-hover:bg-white transition-colors duration-300 ease-in-out",
                            p.sale.hasSpaceForNewPurchase == false && "bg-gray-300"
                        )}
                        classNameFilled={p.sale.hasSpaceForNewPurchase == false ? "bg-red-400" : ""}
                    />


                </div>
            </div>
        </div>
    </Card>
}