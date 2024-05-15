import { i18nConfig } from "@/i18n/i18nConfig";

const { defaultLocale } = i18nConfig;

const languageChecker = (url: string, currentLanguage: string | undefined) => {
	return currentLanguage === undefined
		? url
		: currentLanguage === defaultLocale
		? url
		: `/${currentLanguage}${url}`;
};

export default languageChecker;
