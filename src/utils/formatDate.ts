// '-u-nu-latn' pins Western digits regardless of ICU defaults, matching the
// site's existing date style (e.g. "12 مايو 2026", not "١٢ مايو ٢٠٢٦").
const arabicDateFormatter = new Intl.DateTimeFormat('ar-u-nu-latn', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});

/** Formats a Date as a long Arabic date with Western digits, e.g. "12 مايو 2026". */
export function formatArabicDate(date: Date): string {
	return arabicDateFormatter.format(date);
}
