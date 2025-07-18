import { APP_NAME } from "@/constants/app-info";

export enum CookiesKeys {
  token = "__" + APP_NAME + "__session_jwt",
  email = "marguerite-email",
}
