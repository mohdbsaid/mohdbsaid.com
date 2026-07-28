// Site-wide language metadata for <LanguageSwitcher>. No page paths here —
// the component derives each language's URL from the *current* page's own
// path (English at the plain route, Arabic under an /ar prefix — see
// docs/DECISIONS.md ADR-019/023), so a new bilingual page pair (About,
// and later Projects/Services/Blog/Store) needs zero changes here or in
// the component itself.
export interface SiteLanguage {
	/** BCP 47 language code, e.g. "en", "ar". */
	code: string;
	/** Compact label shown in the switcher, in the language's own script. */
	label: string;
	/** Full language name, used for the accessible link description. */
	name: string;
	dir: 'ltr' | 'rtl';
}

export const siteLanguages: SiteLanguage[] = [
	{ code: 'en', label: 'EN', name: 'English', dir: 'ltr' },
	{ code: 'ar', label: 'العربية', name: 'العربية', dir: 'rtl' },
];
