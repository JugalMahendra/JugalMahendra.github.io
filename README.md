# Jugal Mahendra — Professional Portfolio (Static)

A modern, responsive, glassmorphism-style portfolio website for **Jugal Mahendra** (Gen AI & ML Innovator • Technology Lead).

## Completed Features

- Responsive, modern single-page portfolio layout
- Hero section with key stats counters
- Sections: About, Skills, Experience, Projects, Education, Contact
- Contact cards (Email / Phone / LinkedIn)
- **Contact form** with:
  - Name, Email, Subject, Message
  - Client-side validation (required fields + email format)
  - Accessible labels, focus styles, and live error hints
  - User-friendly success/error status messages
  - **No-backend default** via `mailto:` fallback

## Entry URIs (Routes)

This is a static site.

- `/index.html` (main page)

On-page anchors:
- `/#home`, `/#about`, `/#skills`, `/#experience`, `/#projects`, `/#education`, `/#contact`

## Contact Form: How It Works

### Default (No Backend): `mailto:`

By default, the form prevents a normal HTTP submit and opens the visitor’s email client using a `mailto:` link.

- Works anywhere (GitHub Pages, basic static hosting)
- Limitation: depends on the visitor having an email app configured

### Option A (Recommended): Netlify Forms (No keys)

If you deploy on **Netlify**, you can turn the form into a real backend-less form submission.

1. In `index.html`, update the form tag like this:

```html
<form
  id="contactForm"
  class="contact-form"
  method="POST"
  name="contact"
  data-netlify="true"
  netlify-honeypot="bot-field"
>
  <input type="hidden" name="form-name" value="contact" />
  <p class="sr-only">
    <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
  </p>
  ...
</form>
```

2. (Optional) Add a Netlify success page or keep the existing in-page status.
3. Deploy on Netlify.

Notes:
- No API keys required.
- Netlify detects the form at build time.

### Option B: Formspree (No private keys)

1. Create a Formspree form and copy the endpoint URL.
2. Add an `action` attribute to the form in `index.html`:

```html
<form id="contactForm" method="POST" action="https://formspree.io/f/yourFormId">
```

3. Formspree may require adding a hidden `_subject` or using their recommended fields (optional).

The JavaScript is written so that:
- If `action` is present and **not** `mailto:`, it submits normally (`form.submit()`).

## Files

- `index.html`
- `css/style.css`
- `js/main.js`

## Not Yet Implemented

- Resume PDF download button (can be added)
- Real profile photo (currently a placeholder)
- Blog / writing section

## Recommended Next Steps

- Add a professional headshot (and replace the placeholder)
- Add a real hosted resume PDF and link it from the hero section
- Configure Netlify Forms or Formspree for a true hosted contact form
- Add SEO enhancements (Open Graph, meta description)

## Public URLs

- LinkedIn: https://www.linkedin.com/in/jugal-mahendra

## Data Models / Storage

- No database.
- No RESTful Table API usage.

---

To deploy your website and make it live, please go to the **Publish tab** where you can publish your project with one click. The Publish tab will handle all deployment processes automatically and provide you with the live website URL.
