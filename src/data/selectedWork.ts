// Personal engineering/digital-systems projects shown in the homepage's
// "Selected work" section — distinct from the `projects` content collection
// (3D-printing build write-ups with their own detail pages). Each entry
// carries both locales together so the English and Arabic copy for one
// project stay reviewable side by side instead of drifting apart in two
// separate files. `en`/`ar` are already flattened, presentation-ready
// strings — <ProjectCard> takes plain props, so each page's frontmatter
// just picks the locale it needs (see src/pages/index.astro / src/pages/ar/index.astro).
import type { IconName } from '../components/Icon.astro';

interface SelectedWorkLocale {
	category: string;
	title: string;
	description: string;
	status: string;
}

export interface SelectedWorkItem {
	icon: IconName;
	en: SelectedWorkLocale;
	ar: SelectedWorkLocale;
}

export const selectedWork: SelectedWorkItem[] = [
	{
		icon: 'shield',
		en: {
			category: 'Additive Manufacturing',
			title: 'Ministry of Defence',
			description:
				'Additive manufacturing work for the Ministry of Defence. Project details are not published here.',
			status: 'Completed',
		},
		ar: {
			category: 'التصنيع الإضافي',
			title: 'وزارة الدفاع',
			description: 'أعمال في التصنيع الإضافي لصالح وزارة الدفاع. تفاصيل المشروع غير منشورة هنا.',
			status: 'مكتمل',
		},
	},
	{
		icon: 'factory',
		en: {
			category: 'Industrial Manufacturing',
			title: 'Jindal Steel Oman',
			description:
				'FDM printing work for Jindal Steel Oman. The scope and outcomes have not been published in detail.',
			status: 'Completed',
		},
		ar: {
			category: 'التصنيع الصناعي',
			title: 'جيندال ستيل عُمان',
			description:
				'أعمال طباعة بتقنية FDM لصالح جيندال ستيل عُمان. لم تُنشر تفاصيل النطاق والنتائج بعد.',
			status: 'مكتمل',
		},
	},
	{
		icon: 'droplet',
		en: {
			category: 'Engineering Support',
			title: 'OQGN',
			description:
				'Additive manufacturing support for OQGN. Project specifications are not published here.',
			status: 'Completed',
		},
		ar: {
			category: 'الدعم الهندسي',
			title: 'OQGN',
			description: 'دعم في التصنيع الإضافي لصالح OQGN. المواصفات الفنية للمشروع غير منشورة هنا.',
			status: 'مكتمل',
		},
	},
];
