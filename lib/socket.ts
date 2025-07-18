import { io } from "socket.io-client";
import { CookiesKeys } from "./cookies";
import Cookies from "js-cookie";

console.log(" connect to ", process.env.NEXT_PUBLIC_DOMAIN);
export const socket = io(process.env.NEXT_PUBLIC_DOMAIN as string, {
  auth: {
    strategy: "jwt",
    token: Cookies.get(CookiesKeys.token),
  },
});
socket.on("connect", () => {
  console.log("connected to socket");
});

export enum SocketEvents {
  PURCHASE_CREATE = "purchase:create",
  PURCHASE_UPDATE = "purchase:update",
  PURCHASE_DELETE = "purchase:delete",
  SALE_CREATE = "sale:create",
  SALE_UPDATE = "sale:update",
  SALE_DELETE = "sale:delete",
  CLIENT_CREATE = "client:create",
  CLIENT_UPDATE = "client:update",
}
