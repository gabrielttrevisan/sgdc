export type Issue = {
  type: string;
  description: string;
};

export type APIError = {
  code: number;
  message: string;
  issues?: Issue[];
};

export type APIResponse<T> = {
  data: T | null;
  error: APIError | null;
};

export type PageData<T> = {
  items: T[];
  page: number;
  totalPages: number;
  totalRecords: number;
  query?: string;
  sortKey?: string;
  sortType?: string;
};

export type PaginatedResponse<T> = APIResponse<PageData<T>>;
