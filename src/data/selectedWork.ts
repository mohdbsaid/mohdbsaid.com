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
				'Additive manufacturing support for defense-grade parts, where tolerances and reliability leave no room for error.',
			status: 'Completed',
		},
		ar: {
			category: 'التصنيع الإضافي',
			title: 'وزارة الدفاع',
			description:
				'دعم تصنيعي بتقنية التصنيع الإضافي لقطع دفاعية لا تحتمل أي هامش خطأ في الدقة أو الموثوقية.',
			status: 'مكتمل',
		},
	},
	{
		icon: 'factory',
		en: {
			category: 'Industrial Manufacturing',
			title: 'Jindal Steel Oman',
			description:
				'FDM production integrated into steel manufacturing workflows — from spare-part prototypes to process tooling.',
			status: 'Completed',
		},
		ar: {
			category: 'التصنيع الصناعي',
			title: 'جيندال ستيل عُمان',
			description:
				'دمج الطباعة بتقنية FDM في مسارات تصنيع الصلب، من نماذج قطع الغيار الأولية إلى أدوات دعم الإنتاج.',
			status: 'مكتمل',
		},
	},
	{
		icon: 'droplet',
		en: {
			category: 'Engineering Support',
			title: 'OQGN',
			description:
				'Manufacturing support for oil & gas infrastructure, producing components built for demanding field conditions.',
			status: 'Completed',
		},
		ar: {
			category: 'الدعم الهندسي',
			title: 'OQGN',
			description:
				'دعم تصنيعي لمكوّنات بنية النفط والغاز، بما يتحمّل ظروف التشغيل الميدانية الصعبة.',
			status: 'مكتمل',
		},
	},
];
