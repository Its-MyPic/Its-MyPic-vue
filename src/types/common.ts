/**
 * 通用錯誤處理型別
 */
export enum ErrorCode {
  INVALID_CARD_DATA = 'INVALID_CARD_DATA',
  FILTER_ERROR = 'FILTER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError extends Error {
  code: ErrorCode;
  details?: unknown;
}

/**
 * 通用工具型別
 */
export type Nullable<T> = T | null;
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 分頁相關型別
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 基礎響應型別
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}
