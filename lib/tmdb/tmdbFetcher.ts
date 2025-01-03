import queryString from "query-string";
import { TMDB_API_BASE_URL, TMDB_API_KEY } from "./apiConfig";

interface FetcherOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  queryParams?: Record<string, string | number | boolean>;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const tmdbFetcher = async <T = unknown>(
  path: string,
  options: FetcherOptions = {},
): Promise<T> => {
  const { method = "GET", queryParams, body, headers = {} } = options;

  const queryStringified = queryParams
    ? `?${queryString.stringify(queryParams)}`
    : "";

  const url = `${TMDB_API_BASE_URL}${path}${queryStringified}`;

  const defaultHeaders: HeadersInit = {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    ...headers,
  };

  if (body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `TMDB API Error (${response.status}): ${errorData.status_message || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
};
