export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createResponse = <T>(success: boolean, data?: T, error?: string): ApiResponse<T> => ({
  success,
  data,
  error,
});
