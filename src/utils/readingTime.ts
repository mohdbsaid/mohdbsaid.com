const WORDS_PER_MINUTE = 200;

/** Arabic minute count with correct plural forms (1/2/3–10/11+), Western digits per formatDate.ts's convention. */
function formatMinutes(minutes: number): string {
	if (minutes === 1) return 'دقيقة واحدة';
	if (minutes === 2) return 'دقيقتان';
	if (minutes <= 10) return `${minutes} دقائق`;
	return `${minutes} دقيقة`;
}

/** Estimates reading time from raw markdown source, e.g. "٥ دقائق قراءة" → "5 دقائق قراءة". */
export function estimateReadingTime(markdown: string): string {
	const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	return `${formatMinutes(minutes)} قراءة`;
}

/** Same estimate as an ISO 8601 duration (e.g. "PT5M") for Article JSON-LD's timeRequired. */
export function estimateReadingMinutesISO(markdown: string): string {
	const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	return `PT${minutes}M`;
}
