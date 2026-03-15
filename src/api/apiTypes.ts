export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
  [key: string]: any;
}