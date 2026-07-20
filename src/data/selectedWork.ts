// Personal engineering/digital-systems projects shown in the homepage's
// "Selected work" section — distinct from the `projects` content collection
// (3D-printing build write-ups with their own detail pages).
export interface SelectedWorkItem {
	label: string;
	title: string;
	description: string;
	status: string;
	/** Font Awesome 6 solid-style icon name (without the "fa-" prefix), shown next to the title. */
	icon: string;
}

export const selectedWork: SelectedWorkItem[] = [
	{
		label: 'Defense',
		title: 'Ministry of Defence',
		description:
			'Strategic additive manufacturing solutions for defense applications and mission-critical parts.',
		status: 'Completed',
		icon: 'shield-halved',
	},
	{
		label: 'Industrial Manufacturing',
		title: 'Jindal Steel Oman',
		description:
			'Industrial 3D printing integration for steel manufacturing processes and spare parts optimization.',
		status: 'Completed',
		icon: 'industry',
	},
	{
		label: 'Oil & Gas',
		title: 'OQGN',
		description:
			'Advanced manufacturing support for oil & gas network infrastructure and pipeline components.',
		status: 'Completed',
		icon: 'oil-well',
	},
];
