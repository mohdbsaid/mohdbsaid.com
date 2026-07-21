// Site-wide language options for <LanguageSwitcher>. Adding a language later
// (or moving to /en/ + /ar/ prefixed routing) means editing this list only —
// the component itself has no language-specific logic. See
// docs/DECISIONS.md ADR-018 for why Arabic points at /about today rather
// than a fabricated Arabic translation of a page that doesn't have one yet.
export interface SiteLanguage {
	/** BCP 47 language code, e.g. "en", "ar". */
	code: string;
	/** Compact label shown in the switcher, in the language's own script. */
	label: string;
	/** Full language name, used for the accessible link description. */
	name: string;
	/** The best available page for this language today. */
	href: string;
	dir: 'ltr' | 'rtl';
}

export const siteLanguages: SiteLanguage[] = [
	{ code: 'en', label: 'EN', name: 'English', href: '/', dir: 'ltr' },
	{ code: 'ar', label: 'العربية', name: 'العربية', href: '/about', dir: 'rtl' },
];
