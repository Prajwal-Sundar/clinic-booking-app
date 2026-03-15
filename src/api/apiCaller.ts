import { buildUrl, buildOptions, handleHttpError, logApi } from "./apiHelpers";
import { ApiEndpoint } from "./apiEndpoints";
import type { ApiResponse } from "./apiTypes";

export async function apiCaller<T = any>(
  endpoint: ApiEndpoint,
  payload?: Record<string, any>
): Promise<ApiResponse<T>> {
  const finalUrl = buildUrl(endpoint, payload);
  const options = buildOptions(endpoint.method, payload);

  try {
    const response = await fetch(finalUrl, options);
    const rawText = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = { message: rawText };
    }

    logApi(finalUrl, endpoint.method, payload, response.status, parsed);

    if (response.ok) {
      return { success: true, status: response.status, data: parsed };
    }

    return handleHttpError(response.status, parsed);
  } catch (err: any) {
    console.error("❌ [API CALLER] Network or unexpected error:", err);
    return {
      success: false,
      status: 500,
      message: "Network error — please check your internet connection.",
    };
  }
}