import { AxiosError } from "axios";

type ApiErrorDetail = {
  path?: Array<string | number>;
  message?: string;
};

type ApiErrorResponse = {
  success: false;
  message?: string;
  code?: string;
  details?: ApiErrorDetail[];
};

export type ParsedApiError = {
  message: string;
  details: string[];
  code?: string;
};

const fallbackMessages: Record<string, string> = {
  AUTH_EMAIL_EXISTS: "This email is already registered. Please sign in or use another email.",
  AUTH_INVALID_CREDENTIALS: "The email or password is incorrect.",
  VALIDATION_ERROR: "Please check the highlighted details and try again.",
};

export const parseApiError = (error: unknown, fallbackMessage: string): ParsedApiError => {
  if (!(error instanceof AxiosError)) {
    return { message: fallbackMessage, details: [] };
  }

  const data = error.response?.data as ApiErrorResponse | undefined;
  const code = data?.code;
  const details =
    data?.details
      ?.map((detail) => {
        const field = detail.path?.join(".");
        return field ? `${field}: ${detail.message ?? "Invalid value"}` : detail.message;
      })
      .filter((detail): detail is string => Boolean(detail)) ?? [];

  return {
    message: (code ? fallbackMessages[code] : undefined) ?? data?.message ?? fallbackMessage,
    details,
    code,
  };
};
