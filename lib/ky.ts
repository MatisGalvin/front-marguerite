import Cookies from "js-cookie";
import ky from "ky";
import { CookiesKeys } from "./cookies";

const apiEndpoint = process.env.NEXT_PUBLIC_STRAPI_API_URL;

// Create a custom ky instance with default headers
const api = ky.create({
  prefixUrl: apiEndpoint,
  headers: {
    //"Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const authToken = Cookies.get(CookiesKeys.token);
        if (authToken) {
          request.headers.set("Authorization", `Bearer ${authToken}`);
        }
      },
    ],
  },
});

export { api };
