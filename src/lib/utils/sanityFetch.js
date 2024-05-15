import { sanityClient } from "sanity:client";
import { i18nConfig } from "@/i18n/i18nConfig";

export const sanityFetch = async ({
  type,
  lang,
  query = "",
  pipe = "",
  object = "",
}) => {
  const langData = await sanityClient.fetch(
    `*[ _type == "${type}" && language == '${lang}' ${query ? "&& " + query : ""} ] ${pipe ? "| " + pipe : ""} ${object}`,
  );

  if (langData?.length) {
    return langData;
  }

  const fallbackData = await sanityClient.fetch(
    `*[ _type == "${type}" && language == '${i18nConfig.defaultLocale}' ${query ? "&& " + query : ""} ] ${pipe ? "| " + pipe : ""} ${object}`,
  );

  return fallbackData;
};
