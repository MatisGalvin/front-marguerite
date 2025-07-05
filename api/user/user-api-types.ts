import { Client } from "@/types/client.type";
import { Purchase } from "@/types/purchase.type";
import { User } from "@/types/user.type";

export type ReadAllClientMeResponse = User & { clients: Client[] };
export type ReadAllPurchaseMeResponse = User & { purchases: Purchase[] };
