// src/utils/apiError.ts
import axios from 'axios';

// True when the request never reached the server (backend down, wrong URL, CORS
// rejection, no network) — as opposed to the server responding with an error status.
export function isNetworkError(err: unknown): boolean {
  return axios.isAxiosError(err) && !err.response;
}
