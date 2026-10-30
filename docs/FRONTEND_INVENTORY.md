# TeddyPups frontend-to-backend inventory

## Inspection scope

Inspected the uploaded `teddypups_work` React/Vite project: `src/main.jsx`, `src/pageMap.js`, `src/components/CapturedPage.jsx`, all 18 files under `src/pages`, `package.json`, and `README.md`.

### Pages found

| Frontend route | Page module | Backend requirement |
|---|---:|---|
| `/` | page0 | Static content; no CMS requirement observed |
| `/puppies` | page1 | `GET /api/v1/puppies` |
| `/happy-families` | page2 | Static captured content; no dynamic management workflow observed |
| `/how-it-works` | page3 | Static content |
| `/faq` | page4 | Static content; no FAQ editor observed |
| `/contact` | page5 | `POST /api/v1/contact` |
| `/gone-home` | page6 | Static captured content; no dedicated API workflow established |
| `/puppies/maltipoo-max-male` | page7 | `GET /api/v1/puppies/:slug`, `POST /api/v1/enquiries` |
| `/puppies/korean-teacup-maltipoo-female` | page8 | Same |
| `/puppies/korean-teacup-poodle-female` | page9 | Same |
| `/puppies/maltipoo-cavapoo-male` | page10 | Same |
| `/puppies/toy-poodle-male-female` | page11 | Same |
| `/puppies/maltipoo-female-2` | page12 | Same |
| `/puppies/pomeranian-female` | page13 | Same |
| `/puppies/copper-male` | page14 | Same |
| `/puppies/shitzu-female` | page15 | Same |
| `/puppies/shitzu-male` | page16 | Same |
| `/puppies/korean-teacup-pomeranian-male` | page17 | Same |

The supplied capture contains 18 page modules and 11 individual puppy profiles. It does not contain every destination linked in the original website.

## Puppy enquiry form — verified fields

The same form structure was found on all 11 puppy profile modules (page7–page17).

| Name | Input type | Required | Constraints / notes | Backend mapping |
|---|---|---:|---|---|
| `name` | text | Yes | `minlength=2`, `maxlength=80`, autocomplete name | Enquiry.name |
| `phone` | tel | Yes | Country code guidance is shown; backend accepts international-style digits and common separators, max 25 chars | Enquiry.phone |
| `email` | email | No | Email format | Enquiry.email |
| `area` | text | No | `maxlength=80`, autocomplete address-level2 | Enquiry.area |
| `puppyId` | hidden | Yes | UUID string; each profile has its own UUID | Resolve Puppy.publicId, then store Mongo ObjectId ref and snapshot |
| `message` | textarea | No | `maxlength=2000`; prefilled with puppy-interest copy | Enquiry.message |
| `website` | hidden honeypot | No | Must remain empty; never store | Validate at API boundary, silently accept/drop non-empty bot submissions |

No `action`, API URL, or backend submission endpoint exists in the captured frontend. The current `src/main.jsx` submit handler prevents submission and displays a notice that the form is not connected.

## Contact form — verified fields

`src/pages/page5.jsx` contains a separate letter-style form. It has:

| Name | Input type | Required | Constraints / notes | Backend mapping |
|---|---|---:|---|---|
| `name` | text | Yes | `minlength=2`, `maxlength=80` | ContactMessage.name |
| `phone` | tel | Yes | Country-code placeholder `+971 50 123 4567` | ContactMessage.phone |
| `email` | email | No | Optional | ContactMessage.email |
| `area` | text | No | `maxlength=80` | ContactMessage.area |
| `puppyId` | select | No | Empty option means any puppy; 15 fixed UUID options are present | Resolve to Puppy where known; preserve public UUID context |
| `message` | textarea | No | `maxlength=2000` | ContactMessage.message |
| `website` | hidden honeypot | No | Must remain empty; never store | Validate at API boundary, silently accept/drop non-empty bot submissions |

Four contact-select puppy IDs have no individual profile module in the supplied ZIP. They are seeded as unpublished reference records solely so contact selections can resolve; they are not exposed in public puppy APIs. These are: `0deaea0d-1c0e-4e85-868b-3c7376358e03`, `cbfa8ebd-7e0c-4818-b0ec-144ede4d3352`, `35d5e8bd-bebb-41c7-b0a9-256482edb3c8`, and `9fd5c518-a1ce-46d4-b9a4-8fb9714717f4`.

## Puppy identifiers and seed data

Profile form UUIDs are preserved as `Puppy.publicId`; MongoDB `_id` remains the internal ObjectId. The seed data contains 11 published profile records and 4 unpublished contact-only reference records. Puppy profile images are stored as frontend-relative `/assets/...` URLs from the supplied project; keep the frontend static asset host available when deploying, or migrate those assets to a CDN and update the URLs.

Seed data contains only facts directly established by the profile route, profile heading, hidden form UUID, visible card/form context and image paths. Age, date of birth and other unverified profile metadata are not fabricated. The seed defaults `status=available` for the 11 profiles because they are the individual puppy pages under the available-puppy workflow; verify current stock/status with the site owner before production import.

## Frontend integration dependencies missing

The uploaded `package.json` contains React, React DOM, Vite and build styling dependencies only. It does **not** contain Redux Toolkit or Axios, and no Redux slices, async thunks, API service layer or admin interface were found. Therefore the backend provides stable REST contracts but cannot honestly claim Redux/Axios integration has been completed in this frontend snapshot. Add Axios/Redux only if that integration is part of the next frontend change.

## Static content decision

Happy-family stories, FAQ, how-it-works, home and gone-home content are rendered as captured page markup. No content-management interface or dynamic content fetch was found. No MongoDB collections or APIs are created for these static pages.
