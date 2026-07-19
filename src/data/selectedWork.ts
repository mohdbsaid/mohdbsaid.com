// Personal engineering/digital-systems projects shown in the homepage's
// "Selected work" section — distinct from the `projects` content collection
// (3D-printing build write-ups with their own detail pages).
export interface SelectedWorkItem {
	label: string;
	title: string;
	description: string;
	status: string;
}

export const selectedWork: SelectedWorkItem[] = [
	{
		label: 'Digital Systems',
		title: 'Lomeez OS',
		description:
			'A lightweight operating system for team execution, KPI tracking, and company-level visibility.',
		status: 'In development',
	},
	{
		label: 'Personal Productivity',
		title: 'Mohammed OS',
		description:
			'A personal and business operating system built around structured data, projects, goals, and reviews.',
		status: 'In development',
	},
	{
		label: 'Engineering Product',
		title: 'Smart Filament Dryer',
		description:
			'A workshop-focused drying system designed to manage multiple filament spools with environmental monitoring.',
		status: 'In development',
	},
];
