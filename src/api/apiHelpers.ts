import { HttpMethod } from "./httpMethods";
import { ApiEndpoint } from "./apiEndpoints";
import type { ApiResponse } from "./apiTypes";

export function buildUrl(endpoint: ApiEndpoint, payload?: Record<string, any>): string {
  let url = `/${endpoint.url}`; // relative URL
  if (endpoint.method === HttpMethod.GET && payload && Object.keys(payload).length > 0) {
    const params = new URLSearchParams(payload).toString();
    url += `?${params}`;
  }
  return url;
}

export function buildOptions(method: HttpMethod, payload?: Record<string, any>): RequestInit {
  const token = localStorage.getItem("authToken"); // optional
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options: RequestInit = { method, headers };
  if (method !== HttpMethod.GET && payload) {
    options.body = JSON.stringify(payload);
  }
  return options;
}

export function handleHttpError(status: number, parsed: any): ApiResponse {
  let message =
    parsed?.message || "Unexpected server response.";

  switch (status) {
    case 400:
      message = "Bad Request — please verify your input.";
      break;
    case 401:
      message = "Unauthorized — please login again.";
      break;
    case 403:
      message = "Forbidden — insufficient permissions.";
      break;
    case 404:
      message = "Not Found — resource does not exist.";
      break;
    default:
      message = "Internal Server Error — please contact admin.";
      break;
  }

  return { success: false, status, message, ...parsed };
}

export function logApi(
  url: string,
  method: string,
  payload: any,
  status: number,
  parsed: any
) {
  console.groupCollapsed(`📡 [API] ${method} → ${url}`);
  console.log("➡️ Payload:", payload);
  console.log("⬅️ Status:", status);
  console.log("⬅️ Response:", parsed);
  console.groupEnd();
}