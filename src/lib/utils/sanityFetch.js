import { sanityClient } from "sanity:client";
import { i18nConfig } from "@/i18n/i18nConfig";

export const sanityFetch = async ({
  type,
  lang,
  query = "",
  pipe = "",
  object = "",
}) => {
  return sanityClient.fetch(`[(
        *[ _type == "${type}" && language == '${lang}' ${query ? "&& " + query : ""} ] +
        *[ _type == "${type}" && language == '${i18nConfig.defaultLocale}' ${query ? "&& " + query : ""} ]
      )[0]] ${pipe ? "| " + pipe : ""} ${object}`);
};
