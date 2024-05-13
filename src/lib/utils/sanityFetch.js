import { sanityClient } from "sanity:client";
import { i18nConfig } from "@/i18n/i18nConfig";

export const sanityFetch = async (type, lang, requestString) => {
  return sanityClient.fetch(`[(
        *[ _type == "${type}" && language == '${lang}' ] +
        *[ _type == "${type}" && language == '${i18nConfig.defaultLocale}']
      )[0]] ${requestString}`);
};
