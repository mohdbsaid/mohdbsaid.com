// Shared client-side behavior for the dark-glassmorphism pages (homepage,
// About) — see docs/DECISIONS.md ADR-023. Extracted so PersonalPortfolio.astro
// and AboutPage.astro don't each carry their own copy of the same script.
// Every piece is a no-op if its target markup isn't present on the page
// (e.g. a page with no .stat-number elements just skips the counter step),
// so one call covers every page regardless of which sections it has.
export function initGlassInteractions(): void {
	const root = document.querySelector('.page-bg');
	if (!root) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ---------- 1. Sticky nav gains a glass background once the page scrolls ----------
	const nav = document.getElementById('siteNav');
	if (nav) {
		const updateNav = () => {
			nav.classList.toggle('is-scrolled', window.scrollY > 8);
		};
		updateNav();
		window.addEventListener('scroll', updateNav, { passive: true });
	}

	// ---------- 2. Counter animation ----------
	const animateCounter = (el: Element) => {
		const target = parseInt(el.getAttribute('data-count') ?? '', 10);
		const suffix = el.getAttribute('data-suffix') ?? '';
		if (Number.isNaN(target)) return;

		if (prefersReducedMotion) {
			el.textContent = target.toLocaleString('en-US') + suffix;
			return;
		}

		const duration = 1400;
		const start = performance.now();

		const tick = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			el.textContent = Math.round(eased * target).toLocaleString('en-US') + suffix;
			if (progress < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	};

	// ---------- 3. Reveal-on-scroll + trigger counters when a stat band enters view ----------
	const counters = root.querySelectorAll('.stat-number');
	let countersAnimated = false;

	const triggerCounters = () => {
		if (countersAnimated || counters.length === 0) return;
		countersAnimated = true;
		counters.forEach((counter) => animateCounter(counter));
	};

	const revealEls = root.querySelectorAll('.reveal');
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					if (entry.target.querySelector('.stat-number')) triggerCounters();
				}
			});
		},
		{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
	);

	revealEls.forEach((el) => observer.observe(el));

	// Trigger if the stat band is already in view on load (short page / tall viewport)
	const statBand = root.querySelector('.stat-band');
	if (statBand && statBand.getBoundingClientRect().top < window.innerHeight * 0.85) {
		triggerCounters();
	}
}
