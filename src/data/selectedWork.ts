// Personal engineering/digital-systems projects shown in the homepage's
// "Selected work" section — distinct from the `projects` content collection
// (3D-printing build write-ups with their own detail pages).
import type { IconName } from '../components/Icon.astro';

export interface SelectedWorkItem {
	label: string;
	title: string;
	description: string;
	status: string;
	/** Icon shown next to the title — see src/components/Icon.astro. */
	icon: IconName;
}

export const selectedWork: SelectedWorkItem[] = [
	{
		label: 'Defense',
		title: 'Ministry of Defence',
		description:
			'Strategic additive manufacturing solutions for defense applications and mission-critical parts.',
		status: 'Completed',
		icon: 'shield',
	},
	{
		label: 'Industrial Manufacturing',
		title: 'Jindal Steel Oman',
		description:
			'Industrial 3D printing integration for steel manufacturing processes and spare parts optimization.',
		status: 'Completed',
		icon: 'factory',
	},
	{
		label: 'Oil & Gas',
		title: 'OQGN',
		description:
			'Advanced manufacturing support for oil & gas network infrastructure and pipeline components.',
		status: 'Completed',
		icon: 'droplet',
	},
];
