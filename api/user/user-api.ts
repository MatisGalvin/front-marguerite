import { api } from "@/lib/ky";
import { User } from "@/types/user.type";
import { ReadAllClientMeResponse } from "./user-api-types";

export class UserAPI {
  static async me(): Promise<User> {
    try {
      return await api.get("users/me").json<User>();
    } catch (err) {
      throw new Error("User could not be found");
    }
  }

  static async readAllClients() {
    const userWithClients = await api
      .get("users/me?populate=clients")
      .json<ReadAllClientMeResponse>();
    return userWithClients.clients;
  }
}
