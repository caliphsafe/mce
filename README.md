# Events by Emcee Co.
43 Build: dependency-free, responsive portfolio and event inquiry website. No package-lock.json.

## Setup still required
- Confirm the business booking address, then set `bookingEmail` in `config.js`. Until set, inquiries can be copied and shared through the verified Instagram account. The form never claims delivery or a reserved date.
- Set `calendarUrl` to the approved appointment scheduling URL when ready. This reveals the consultation button; it does not require a redesign.
- Repository: https://github.com/caliphsafe/mce. Vercel should deploy the main branch.

## Files
- index.html — content, inquiry form, portfolio lightbox, FAQ
- styles.css — responsive visual design
- app.js — filtering, lightbox, mobile navigation, inquiry preparation
- config.js — booking email and optional calendar URL
- portfolio.json — editable image titles, categories, source post links
- assets/ — uploaded logo and 24 locally stored Instagram images / reel covers
- asset-sources.json — photo provenance
- vercel.json — buildless Vercel setup

Instagram exposed 24 public grid images; older posts and carousel interiors require sign-in. The collaboration image retains its original source attribution link. Portfolio titles describe the visible decorations; they are editorial labels rather than quoted captions. No invented reviews, prices, service area, policies, or founder details.

## Booking
The site prepares a client-side inquiry. With bookingEmail configured, it offers a mailto email draft for the visitor to review and send. It has no database and does not transmit form data automatically. Calendar integration remains off until a confirmed URL is supplied.

## Visual standard
No emojis. UI icons are inline SVG. Palette: warm ivory, soft rose, muted plum. Buttons use deep plum. The supplied logo has been recreated as a transparent PNG.
