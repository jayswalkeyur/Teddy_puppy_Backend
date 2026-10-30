# Frontend integration handoff

The supplied frontend does not currently have Axios or Redux Toolkit installed. This is a contract/example only; no frontend files were changed by the backend build.

## Axios client

```js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const getPuppies = (params = {}) => api.get('/puppies', { params });
export const getPuppyBySlug = (slug) => api.get(`/puppies/${encodeURIComponent(slug)}`);
export const submitPuppyEnquiry = (payload) => api.post('/enquiries', payload);
export const submitContact = (payload) => api.post('/contact', payload);
```

Set `VITE_API_BASE_URL=http://localhost:5000/api/v1` in the frontend `.env` during local development. In production, use the deployed API origin and configure the backend `CLIENT_URL` to the frontend origin.

## Puppy enquiry payload

```js
{
  name: 'Customer name',
  phone: '+971 50 123 4567',
  email: 'optional@example.com',
  area: 'Dubai Marina',
  puppyId: '4218427a-dd65-4b09-a089-584b912aa7ab',
  message: 'I would like to know more about Max.',
  website: ''
}
```

## Contact form payload

```js
{
  name: 'Customer name',
  phone: '+971 50 123 4567',
  email: 'optional@example.com',
  area: 'Dubai Marina',
  puppyId: '',
  message: 'Please contact me.',
  website: ''
}
```

## Admin calls

After login, attach `Authorization: Bearer <accessToken>` to admin requests. Do not put the access token in localStorage if your threat model requires stronger XSS protection; this API release currently returns the access token in the login JSON response and does not implement a refresh-cookie flow.
