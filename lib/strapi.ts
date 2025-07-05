import {
  StrapiAttributes,
  StrapiResult,
  StrapiResultList,
} from "@/types/strapi.type";

export function formatStrapiResponse<T>(strapiResp: StrapiResultList<T>): T[];
export function formatStrapiResponse<T>(strapiResp: StrapiResult<T>): T;
export function formatStrapiResponse<T>(
  strapiResp: StrapiResultList<T> | StrapiResult<T>
): T | T[] {
  const formatResultRecursively = <U>(
    data: StrapiAttributes<U> | StrapiAttributes<U>[]
  ): U | U[] => {
    if (Array.isArray(data)) {
      return data.map((item) => formatResultRecursively(item)).flat() as U[];
    } else {
      const id = data?.id;
      const attributes = data?.attributes;
      //it's coming formated we don't format it
      if (!id || !attributes) {
        // add base url to images in the response ( shoud be done back...)
        const prependDomainToUrl = (obj: any) => {
          Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              prependDomainToUrl(obj[key]); // Recursive call for nested objects
            } else if (key === 'url' && typeof obj[key] === 'string') {
              // Prepend the base URL to the image URL if it's not already formatted
              obj[key] = `${process.env.NEXT_PUBLIC_DOMAIN}${obj[key]}`;
            }
          });
        };

        if (typeof data === 'object' && data !== null) {
          prependDomainToUrl(data);
        }
        return data as U;
      }
      const result: any = { id };
      Object.keys(attributes).forEach((key) => {
        if (attributes[key] && typeof attributes[key] === "object") {
          if ("data" in attributes[key] && attributes[key].data) {
            const formattedData = formatResultRecursively(attributes[key].data);
            result[key] = Array.isArray(attributes[key].data)
              ? formattedData
              : (formattedData as U[]); // Explicitly cast formattedData as U[]
          } else {
            result[key] = attributes[key];
          }
        } else if (
          key === "url" &&
          typeof attributes[key] === "string" &&
          attributes["provider"] === "local"
        ) {
          // Check if the key is 'url', its value is a string, and the provider is 'local'
          // Prepend the base URL to the image URL
          result[key] = `${process.env.NEXT_PUBLIC_DOMAIN}${attributes[key]}`;
        } else {
          result[key] = attributes[key];
        }
      });
      return result as U; // Explicitly cast result as U
    }
  };

  const formattedData = formatResultRecursively(strapiResp.data);
  return Array.isArray(strapiResp.data) ? formattedData : formattedData;
}
