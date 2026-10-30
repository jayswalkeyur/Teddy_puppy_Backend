# TeddyPups Backend

Production-oriented REST API for the supplied TeddyPups React/Vite site. Built with Node.js, Express 4, TypeScript, MongoDB/Mongoose, Joi, JWT, bcryptjs, Helmet, CORS, HPP, express-rate-limit and Pino HTTP logging.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- MongoDB 6+
- npm

## Install and configure
```bash
npm install
cp .env.example .env
```
Set at least `MONGODB_URI`, `CLIENT_URL`, `JWT_ACCESS_SECRET` (32+ random characters), `ADMIN_NAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` in `.env`. Never commit `.env`.

## Seed and run
```bash
npm run seed:puppies
npm run seed:admin
npm run dev
```
API base: `http://localhost:5000/api/v1`; health: `GET http://localhost:5000/api/v1/health`.

For production:
```bash
npm run build
npm start
```

## Scripts
- `npm run dev` — TypeScript watch server
- `npm run build` — compile to `dist/`
- `npm start` — run compiled server
- `npm test` — run Vitest tests
- `npm run seed:puppies` — insert 11 profile records and 4 unpublished contact-only records (idempotent)
- `npm run seed:admin` — create/update the admin from environment variables

## Authentication
`POST /api/v1/auth/login` returns a short-lived bearer access token. Send it as `Authorization: Bearer <token>` to admin routes. Roles are `admin` and `manager`; both can manage the admin API surface in this first release. There is no public registration. Logout is client-side token disposal because the access token is stateless. Refresh tokens and server-side revocation are intentionally not advertised or partially implemented.

## Logging and errors
Every HTTP request, including GET, is logged with Pino HTTP. Development uses `pino-pretty`; production emits structured JSON. Authorization and cookie headers are redacted; request bodies are not logged. All errors pass through one middleware and include a request ID. Production errors do not expose stack traces or database internals.

## Data and frontend integration
Read `docs/FRONTEND_INVENTORY.md` for the inspected page/form inventory and important UUID mapping. Read `docs/API.md` for route contracts. The frontend currently does not include Axios or Redux Toolkit, nor an API layer; this backend does not claim those frontend changes have already been made. The puppy image paths point to static files served by the frontend (for example `/assets/image.4a9f9.jpg`). Keep that static asset host accessible or migrate images to cloud storage before separating domains.

## API documentation and testing assets
- `docs/openapi.yaml` — OpenAPI 3.0 definition for the implemented routes.
- `postman/TeddyPups.postman_collection.json` — importable Postman collection; set `baseUrl`, then login and set `token` for admin calls.
- `tests/` — validation and basic app contract tests.

## Deployment checklist
1. Provision MongoDB and a restricted DB user; set `MONGODB_URI`.
2. Set a strong unique `JWT_ACCESS_SECRET` and admin credentials through secret management.
3. Set exact production `CLIENT_URL`; configure `TRUST_PROXY` to the trusted reverse-proxy hop count only.
4. Use HTTPS and a reverse proxy/load balancer; configure proxy IP handling accurately.
5. Ensure frontend `/assets/*` URLs remain resolvable or update image URLs to a CDN.
6. Run seeds once, verify the initial puppy statuses/images with the site owner, then deploy the compiled `dist` output.
7. Monitor logs and database backups; rate-limit values may need tuning to actual traffic.

## Known boundaries
- No file-upload pipeline was added because the supplied frontend has no upload workflow.
- No dynamic CMS models were added for FAQ, happy families, how-it-works or other captured static pages.
- The frontend capture contains 11 profile pages; four additional contact dropdown IDs are reference-only and unpublished.
- `status=available` on the 11 initial puppy seeds is a deployment assumption based on their position as available-puppy profiles. Confirm real availability before importing to production.
- Refresh-token rotation, email notifications, CRM integrations and server-side token revocation are not implemented because no corresponding frontend flow or credentials were present.
- Build/test commands are provided but require `npm install` and a reachable npm registry; do not treat this generated project as production-verified until the commands pass in your environment.
