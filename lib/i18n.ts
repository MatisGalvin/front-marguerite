"use client";
import i18next from "i18next";
import * as z from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/fr/zod.json";

// lng and resources key depend on your locale.
i18next.init({
  lng: "fr",
  resources: {
    fr: {
      zod: {
        ...translation,
        errors: {
          ...translation.errors,
          invalid_type: "Requis",
        },
      },
    },
  },
});
z.setErrorMap(zodI18nMap);
