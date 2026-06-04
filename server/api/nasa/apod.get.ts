import { fetchApodFromNasa } from '~~/lib/nasa/apod';

// Server-side proxy so the NASA_API_KEY secret is used for every request,
// including client-side navigations where the key is not available.
export default defineEventHandler(async () => {
  return fetchApodFromNasa();
});
