# Content Admin Guide

This is a plain-language guide to editing this website's text, images, and pages **without writing any code**. You don't need to understand Astro, TypeScript, or how the site is built — you only need to edit plain text files in specific folders, following the examples below.

If you get stuck, the safest thing to do is: change one small thing, save, and check the site still looks right (see "How to preview your changes" below) before changing anything else.

---

## How the site is organized (in plain terms)

- **`src/content/`** — this is where almost all the words on the site live. Each page's text is broken into small files you can open and edit like a document.
- **`src/data/site.ts`** — one file with your name, email, phone/WhatsApp number, and similar facts. Change it once here and it updates everywhere on the site.
- **`src/assets/images/`** — where photos and images go.
- Everything else (folders full of code) you should not need to touch for normal content updates.

---

## How to edit the homepage text

The homepage (`/` in English, `/ar` in Arabic) has three sections: **Hero** (the big introduction), **Work** (the section heading above your projects), and **Contact**.

Open these files in a text editor:

- English hero: `src/content/pages/home/hero/en.mdx`
- Arabic hero: `src/content/pages/home/hero/ar.mdx`
- English "Work" heading: `src/content/pages/home/workintro/en.mdx`
- Arabic "Work" heading: `src/content/pages/home/workintro/ar.mdx`
- English contact text: `src/content/pages/home/contact/en.mdx`
- Arabic contact text: `src/content/pages/home/contact/ar.mdx`

Each file looks like this:

```mdx
---
type: hero
tagline: 'I turn ideas into physical parts — through reliable FDM production...'
emailLabel: 'Email'
whatsappLabel: 'WhatsApp'
---
```

Everything between the `---` lines (called "frontmatter") is a label followed by a colon and the text in quotes. Just change the text inside the quotes and save. Don't remove the quotes, the colons, or the `---` lines.

The homepage's project cards ("Selected Work") come from a different file: `src/data/selectedWork.ts` — see "How to add a project" below for the difference between this list and the full Projects page.

---

## How to edit the About page

The About page (`/about` in English, `/ar/about` in Arabic) has more sections, each in its own file under `src/content/pages/about/`:

| Section                    | English file                                    | Arabic file                                     |
| -------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Hero intro                 | `src/content/pages/about/hero/en.mdx`           | `src/content/pages/about/hero/ar.mdx`           |
| Profile paragraph(s)       | `src/content/pages/about/profile/en.mdx`        | `src/content/pages/about/profile/ar.mdx`        |
| Achievements/numbers       | `src/content/pages/about/achievements/en.mdx`   | `src/content/pages/about/achievements/ar.mdx`   |
| Professional experience    | `src/content/pages/about/experience/en.mdx`     | `src/content/pages/about/experience/ar.mdx`     |
| Industries & clients       | `src/content/pages/about/industries/en.mdx`     | `src/content/pages/about/industries/ar.mdx`     |
| Technical expertise        | `src/content/pages/about/skills/en.mdx`         | `src/content/pages/about/skills/ar.mdx`         |
| Training paragraph         | `src/content/pages/about/training/en.mdx`       | `src/content/pages/about/training/ar.mdx`       |
| Education & certifications | `src/content/pages/about/certifications/en.mdx` | `src/content/pages/about/certifications/ar.mdx` |
| Philosophy paragraph       | `src/content/pages/about/philosophy/en.mdx`     | `src/content/pages/about/philosophy/ar.mdx`     |
| Career timeline            | `src/content/pages/about/timeline/en.mdx`       | `src/content/pages/about/timeline/ar.mdx`       |
| Contact text               | `src/content/pages/about/contact/en.mdx`        | `src/content/pages/about/contact/ar.mdx`        |

**Two kinds of sections:**

1. **Paragraph sections** (Profile, Training, Philosophy, Contact) — the text you edit is written as normal paragraphs **below** the second `---` line, like a document. Just edit the sentences directly. Leave a blank line between paragraphs.

   ```mdx
   ---
   type: prose
   eyebrow: 'Profile'
   heading: 'Profile'
   ---

   My path into additive manufacturing started with a diploma in...

   Alongside that production work, I've spent a significant part of my career...
   ```

2. **List/structured sections** (Achievements, Experience, Industries, Skills, Certifications, Timeline) — the text lives inside the frontmatter as a list. Follow the existing pattern exactly (the dashes and indentation matter). For example, to add a new job to Experience:

   ```yaml
   roles:
     - title: '3D Printing Specialist'
       company: 'Plamore Manufacture'
       period: 'Dec 2024 – Jan 2026'
       description: 'Operated and maintained professional FDM systems...'
     - title: 'Your New Job Title'
       company: 'Company Name'
       period: 'Feb 2026 – Present'
       description: 'What you did there.'
   ```

   Copy an existing entry (the `- title: ...` block), paste it, and change the values — that's the safest way to avoid breaking the formatting.

**Important:** always edit the **same section in both languages** (`en.mdx` and `ar.mdx`) when the change should apply everywhere — the two files are independent and don't auto-translate each other. Arabic copy on this site is written naturally for Arabic readers, not translated word-for-word from English — keep that style when adding new Arabic text.

---

## How to replace the profile photo

There's no photo on the site today — the homepage/About hero shows your initials in a circle instead. To add a real photo:

1. Put the image file in `src/assets/images/profile/` (e.g. `mohammed.jpg`).
2. Ask a developer to wire it into the hero using Astro's `<Image>` component (a one-line change in `PersonalPortfolio.astro`/`AboutPage.astro`) — this part does need a code change, since it also involves deciding the photo's size/crop.

---

## How to add a project

There are **two different places projects can appear** — know which one you want:

- **Homepage "Selected Work"** (3 highlighted client projects) — edit `src/data/selectedWork.ts`. Copy one of the existing entries (the `{ icon: ..., en: {...}, ar: {...} }` block) and fill in your own `category`, `title`, `description`, `status` for both languages.
- **The `/projects` page** (full project write-ups with their own page) — add a new file in `src/content/projects/`, named after your project, e.g. `src/content/projects/my-new-project.md`:

  ```md
  ---
  title: 'Project Title'
  description: 'One or two sentences describing the project.'
  category: 'Category Name'
  publishDate: 2026-08-01
  featured: true
  status: 'Completed'
  client: 'Client Name'
  year: 2026
  technologies: ['PLA', 'Fusion 360']
  links:
    demo: 'https://example.com'
  ---

  Write the full project story here using normal paragraphs and `##` for section headings.
  ```

  Only fill in the fields you actually know — `client`, `year`, `technologies`, `links`, `status` are all optional. Set `featured: true` only for projects you want highlighted; `draft: true` hides a project until it's ready to publish.

  To add a cover photo, put it in `src/assets/images/projects/` and reference it from the frontmatter, e.g. `cover: '../../assets/images/projects/my-photo.jpg'` (and always set `coverAlt` — a short description of the image — whenever you set `cover`).

  To add a photo gallery (shown near the bottom of the project page), add a `gallery` list — each entry needs both the image and its own alt text:

  ```yaml
  gallery:
    - image: '../../assets/images/projects/photo-1.jpg'
      alt: 'A short, honest description of this specific photo.'
    - image: '../../assets/images/projects/photo-2.jpg'
      alt: 'Description of the second photo.'
  ```

  Projects in the same `category` automatically show up as "Related Projects" at the bottom of each other's pages — you don't need to link them yourself.

---

## How to add a blog article

Add a new file in `src/content/blog/`, e.g. `src/content/blog/my-new-article.md`:

```md
---
title: 'Article Title'
description: 'A short summary shown in listings and search results.'
category: 'Category Name'
tags: ['Tag One', 'Tag Two']
publishDate: 2026-08-01
featured: false
---

Write your article here using normal paragraphs, `##` for headings, and blank lines between paragraphs.
```

- `draft: true` keeps an article hidden until you're ready to publish it (just remove that line, or set it to `false`, when it's ready).
- `updatedDate: 2026-08-15` can be added later if you revise an already-published article.
- Reading time is calculated automatically — you don't need to write it.

---

## How to add a service

`/services` is live and lists whatever is published here — right now that's nothing, so the page shows a "no services published yet" message with a contact button instead. To publish a real service, add a file to `src/content/services/`, e.g. `src/content/services/3d-printing-consulting.md`:

```md
---
title: 'Service Title'
description: 'One or two sentences describing the service — shown on the services listing page.'
publishDate: 2026-08-01
icon: 'wrench'
whoItsFor:
  - 'Schools adopting 3D printing for STEM programs'
  - 'Small manufacturers needing occasional prototyping'
process:
  - title: 'Initial consultation'
    description: 'We discuss your goals, constraints, and timeline.'
  - title: 'Proposal'
    description: 'You get a scoped plan before any work begins.'
deliverables:
  - 'A working prototype or trained team, depending on the engagement'
technologies: ['FDM', 'Fusion 360']
faq:
  - question: 'How long does a typical engagement take?'
    answer: 'It depends on scope — discussed upfront in the initial consultation.'
---

Write the overview/summary of the service here as normal paragraphs.
```

Every field except `title`/`description`/`publishDate` is optional — only include a section (`whoItsFor`, `process`, `deliverables`, `technologies`, `faq`) if it's true and you want it shown; the page simply omits any section you leave out. `icon` must be one of the names already used in `Icon.astro` (e.g. `print`, `wrench`, `code`, `book`) — ask a developer if you need a new one.

---

## How to add a store product

`/store` is live the same way `/services` is — currently empty with an honest "nothing published yet" message, since there's no checkout/payment integration (this is a content architecture only, not a working store). Add a file to `src/content/store/` to publish a product:

```md
---
title: 'Product Name'
description: 'Product description — shown on the store listing page.'
publishDate: 2026-08-01
category: 'Category Name'
status: 'In Stock'
price: 25
currency: 'OMR'
specifications:
  - label: 'Material'
    value: 'PLA'
  - label: 'Dimensions'
    value: '10 × 10 × 5 cm'
---

Write the product overview here as normal paragraphs.
```

`category`, `status`, `price`/`currency`, `specifications`, and `gallery` (same `image`+`alt` format as a project's gallery) are all optional — only set what's true. Since there's no checkout, the product page's call-to-action is "contact me to inquire or order," not a buy button — that's intentional, not a bug.

---

## How to replace images

1. Find the right folder under `src/assets/images/` — `profile/`, `projects/`, `blog/`, `services/`, `clients/`, `gallery/`, or `logos/` (each has its own short `README.md` explaining what belongs there).
2. Add your image file there.
3. Reference it from the relevant content file's frontmatter (e.g. a project's `cover:` field) using a relative path, like `../../assets/images/projects/your-file.jpg`.
4. Always fill in the matching `*Alt` field (e.g. `coverAlt`) with a short, honest description of the image — this is required for accessibility and is enforced automatically (the site won't build if you set an image without its alt text).

---

## How to edit navigation

The menu links shown in the header/footer live in `src/data/nav.ts`. Each entry looks like:

```ts
{ label: 'من أنا', href: '/ar/about' },
```

Change `label` (the text shown) or `href` (the link target) directly. Adding a new link means adding a new line in the same format — but make sure the page it links to actually exists first.

---

## How to update contact details (name, email, phone, socials)

Open `src/data/site.ts`. This one file controls your name, initials, professional title, email, WhatsApp number, and social links everywhere on the site — change a value here once and it updates on every page automatically. Don't edit these values anywhere else; if you find the same email or phone number hardcoded somewhere else in the code, that's a bug — flag it to a developer.

---

## How to update SEO (titles, descriptions, search appearance)

Each page's search-engine title and description are set at the top of its page file (e.g. `src/pages/about.astro`, in the `title`/`description` lines) — these aren't in `src/content/` because they're closely tied to that specific page's technical setup. Ask a developer to adjust these, or, if you're comfortable, edit the quoted text directly after the `title =` and `description =` lines near the top of the file — don't change anything else in that file.

---

## How to preview your changes

Before publishing, you (or a developer) can run the site locally to check your changes look right:

```
npm run dev
```

Then open the address it prints (usually `http://localhost:4321`) in a browser and click through to the page you changed.

---

## How to deploy

This site builds as static files, and the intended host is Cloudflare Pages connected directly to this GitHub repository. In practice, once that connection is set up:

1. Save your content changes.
2. Commit and push them to the `main` branch on GitHub (a developer can do this for you, or use GitHub's own web editor for simple text edits).
3. Cloudflare Pages automatically rebuilds and publishes the site within a few minutes of the push — there's no separate manual deploy step.

**Before relying on this:** confirm the production domain actually resolves and serves the site (open it in a browser, or ask a developer to check). As of this writing the production domain does not resolve — either the Cloudflare Pages project isn't connected yet, the custom domain isn't attached, or DNS isn't configured. This needs to be fixed in the domain registrar's and Cloudflare's own dashboards (outside this repository) before pushing to `main` actually publishes anything publicly.

If you want to double check a change builds correctly before pushing, a developer can run `npm run build` locally — this is the same build Cloudflare Pages should run, so if it succeeds locally it will succeed on deploy once hosting is actually connected.

---

## Getting help

If something looks broken after an edit, the most common cause is a small formatting mistake in a content file (a missing quote, a missing dash, wrong indentation). Undo your last change (or ask a developer to check `git diff`) rather than guessing at more changes — content files are plain text tracked in Git, so nothing is ever permanently lost.
