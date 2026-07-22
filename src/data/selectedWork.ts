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
				'Strategic additive manufacturing solutions for defense applications and mission-critical parts.',
			status: 'Completed',
		},
		ar: {
			category: 'التصنيع الإضافي',
			title: 'وزارة الدفاع',
			description: 'حلول تصنيع إضافي استراتيجية لتطبيقات دفاعية وقطع حسّاسة تتطلب دقة عالية.',
			status: 'مكتمل',
		},
	},
	{
		icon: 'factory',
		en: {
			category: 'Industrial Manufacturing',
			title: 'Jindal Steel Oman',
			description:
				'Industrial 3D printing integration for steel manufacturing processes and spare parts optimization.',
			status: 'Completed',
		},
		ar: {
			category: 'التصنيع الصناعي',
			title: 'جيندال ستيل عُمان',
			description:
				'دمج تقنيات الطباعة ثلاثية الأبعاد ضمن عمليات تصنيع الصلب، وتحسين إنتاج قطع الغيار.',
			status: 'مكتمل',
		},
	},
	{
		icon: 'droplet',
		en: {
			category: 'Engineering Support',
			title: 'OQGN',
			description:
				'Advanced manufacturing support for oil & gas network infrastructure and pipeline components.',
			status: 'Completed',
		},
		ar: {
			category: 'الدعم الهندسي',
			title: 'OQGN',
			description: 'دعم تصنيعي متقدم لمكوّنات شبكات النفط والغاز وخطوط الأنابيب.',
			status: 'مكتمل',
		},
	},
];
