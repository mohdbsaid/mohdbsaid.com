// Single source of truth for global identity/contact facts reused across
// pages and components (SEO meta, JSON-LD, hero/contact CTAs, footer,
// RSS feed title). Anything here must never be re-typed as a literal
// anywhere else — import from this file instead. See docs/DECISIONS.md
// ADR-024 and content-admin/README.md ("How to update contact details").
//
// Locale-specific *content copy* (hero taglines, About prose, achievement
// labels, etc.) does NOT belong here — that lives in src/content/pages/
// (see src/content.config.ts's `pages` collection). This file is only for
// facts that are true regardless of language.
export interface LocalizedText {
	en: string;
	ar: string;
}

export interface SiteConfig {
	name: LocalizedText;
	/** Short initials shown in the hero's circular mark, e.g. "MA" / "م ج". */
	initials: LocalizedText;
	/** Professional title/role — reused in hero copy, <SEO> jsonLd's jobTitle, meta descriptions. */
	title: LocalizedText;
	location: LocalizedText;
	/** Sitewide fallback meta description — Arabic only; every English page defines its own per-page description instead of falling back to this. */
	description: { ar: string };
	email: string;
	whatsapp: {
		/** Human-readable display form, e.g. "+968 91899818". */
		display: string;
		/** wa.me deep link. */
		url: string;
	};
	/** Production site origin — kept in sync with astro.config.mjs's `site`. */
	website: string;
	/**
	 * Social/professional profile links. Only set a field once a real profile
	 * exists — omitted fields render nothing rather than a dead/fake link
	 * (see docs/DECISIONS.md ADR-010's "wired but not exercised" precedent).
	 */
	social: {
		github?: string;
		linkedin?: string;
	};
}

export const site: SiteConfig = {
	name: { en: 'Mohammed Al-Jabri', ar: 'محمد الجابري' },
	initials: { en: 'MA', ar: 'م ج' },
	title: {
		en: 'Additive Manufacturing & 3D Printing Specialist',
		ar: 'أخصائي التصنيع الإضافي والطباعة ثلاثية الأبعاد',
	},
	location: { en: 'Oman', ar: 'عُمان' },
	description: { ar: 'موقع شخصي لتوثيق مشاريعي، مقالاتي، وأعمالي في الطباعة ثلاثية الأبعاد.' },
	email: 'mohdbsaid@outlook.com',
	whatsapp: {
		display: '+968 91899818',
		url: 'https://wa.me/96891899818',
	},
	website: 'https://mohdbsaid.com',
	social: {
		// github: undefined,
		// linkedin: undefined,
	},
};
