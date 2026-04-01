import { isAxiosError } from 'axios';

type ApiErrorData = {
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorData | string>(error)) {
    return fallback;
  }

  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof data.message === 'string' &&
    data.message.trim()
  ) {
    return data.message;
  }

  return fallback;
}
