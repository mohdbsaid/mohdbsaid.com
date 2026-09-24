import type { NavItem } from '../types';

// Single source of truth for primary site navigation — consumed by both
// Header.astro and Footer.astro so the link list is never duplicated.
export const primaryNav: NavItem[] = [
	{ label: 'الرئيسية', href: '/ar' },
	{ label: 'من أنا', href: '/ar/about' },
	{ label: 'المشاريع', href: '/projects' },
	{ label: 'الخدمات', href: '/services' },
	{ label: 'المدونة', href: '/blog' },
	{ label: 'تواصل', href: '/contact' },
];
