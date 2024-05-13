import { sanityClient } from "sanity:client";

export const sanityFetch = async (type, lang, defaultLocale, requestString) => {
  return sanityClient.fetch(`[(
        *[ _type == "${type}" && language == '${lang}' ] +
        *[ _type == "${type}" && language == '${defaultLocale}']
      )[0]] ${requestString}`);
};
