// Personal engineering/digital-systems projects shown in the homepage's
// "Selected work" section — distinct from the `projects` content collection
// (3D-printing build write-ups with their own detail pages).
import type { IconName } from '../components/Icon.astro';

export interface SelectedWorkItem {
	category: string;
	title: string;
	description: string;
	status: string;
	/** Icon shown on the project card — see src/components/Icon.astro. */
	icon: IconName;
}

export const selectedWork: SelectedWorkItem[] = [
	{
		category: 'Additive Manufacturing',
		title: 'Ministry of Defence',
		description:
			'Strategic additive manufacturing solutions for defense applications and mission-critical parts.',
		status: 'Completed',
		icon: 'shield',
	},
	{
		category: 'Industrial Manufacturing',
		title: 'Jindal Steel Oman',
		description:
			'Industrial 3D printing integration for steel manufacturing processes and spare parts optimization.',
		status: 'Completed',
		icon: 'factory',
	},
	{
		category: 'Engineering Support',
		title: 'OQGN',
		description:
			'Advanced manufacturing support for oil & gas network infrastructure and pipeline components.',
		status: 'Completed',
		icon: 'droplet',
	},
];
