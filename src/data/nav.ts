import type { NavItem } from '../types';

// Single source of truth for primary site navigation — consumed by both
// Header.astro and Footer.astro so the link list is never duplicated.
export const primaryNav: NavItem[] = [
	{ label: 'الرئيسية', href: '/' },
	{ label: 'من أنا', href: '/about' },
	{ label: 'المشاريع', href: '/projects' },
	{ label: 'المدونة', href: '/blog' },
	{ label: 'تواصل', href: '/contact' },
];

export const legalNav: NavItem[] = [
	{ label: 'سياسة الخصوصية', href: '/privacy' },
	{ label: 'الشروط', href: '/terms' },
];
