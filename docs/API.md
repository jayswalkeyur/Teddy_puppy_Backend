# API contract

Base path: `/api/v1`. JSON responses use `{ success, message?, data }`; list endpoints return `{ success, data, pagination }`. Errors use `{ success:false, message, errorCode, requestId, errors? }`.

## Health
- `GET /health` — public database/application readiness summary.

## Authentication (admin)
- `POST /auth/login` — `{ email, password }`; returns short-lived bearer access token and safe user summary.
- `GET /auth/me` — bearer token required.
- `POST /auth/logout` — bearer token required; stateless access token is discarded by client. Token revocation/refresh is not implemented in this release.

## Public puppies
- `GET /puppies?page=1&limit=12&q=&breed=&gender=&status=&featured=&sort=createdAt&order=desc`
- `GET /puppies/search` — same query contract as list.
- `GET /puppies/featured`
- `GET /puppies/:slug`

Only published, non-archived puppies are visible publicly. `page` defaults to 1; `limit` defaults to 12 and maxes at 50. Search accepts a text term, never a MongoDB filter. Allowed sort fields: `createdAt`, `name`, `breed`, `publishedAt`.

## Admin puppies (admin or manager bearer token)
- `GET /admin/puppies?page=1&limit=20`
- `GET /admin/puppies/:id`
- `POST /admin/puppies` — full validated puppy object; `publicId`, `name`, and `breed` required.
- `PATCH /admin/puppies/:id` — partial validated update; `publicId` cannot be changed.
- `DELETE /admin/puppies/:id` — soft archive; record is unpublished and gets `deletedAt`.

## Enquiries
- `POST /enquiries` — public body `{ name, phone, email?, area?, puppyId, message?, website? }`. `puppyId` is the frontend UUID, not Mongo ObjectId. The server resolves the UUID and snapshots puppy name/slug. `website` is honeypot-only and is never persisted.
- `GET /admin/enquiries?page=1&limit=20&status=&puppyId=` — admin/manager only.
- `GET /admin/enquiries/:id` — admin/manager only.
- `PATCH /admin/enquiries/:id` — `{ status: "new"|"contacted"|"qualified"|"closed" }`.

## Contact messages
- `POST /contact` — public body `{ name, phone, email?, area?, puppyId?, message?, website? }`. `puppyId` may be empty (the contact form's "any puppy" option) or a frontend UUID from the fixed select list.
- `GET /admin/contact-messages?page=1&limit=20&status=` — admin/manager only.
- `GET /admin/contact-messages/:id` — admin/manager only.
- `PATCH /admin/contact-messages/:id` — `{ status: "new"|"contacted"|"closed" }`.

## Status codes
- `200` success; `201` created; `400` validation/invalid ID; `401` missing/invalid/expired access token; `403` insufficient role; `404` missing route/resource; `409` duplicate key; `429` rate limit; `500` unexpected server error.

## Security notes
- CORS allowlist uses `CLIENT_URL` plus localhost origins in development. Do not use wildcard origins with credentials.
- Helmet, HPP, request body limits, JSON parsing limits, global and per-submission rate limits, Joi validation, Mongoose sanitization and centralized errors are configured.
- Pino HTTP logs every request including GET, with request ID, method, path, status and response time. Authorization/cookie headers and common secret paths are redacted; request bodies are not logged.
- Admin access tokens are short-lived JWTs. Refresh tokens/cookies are intentionally omitted rather than shipping an incomplete refresh-token rotation implementation.
