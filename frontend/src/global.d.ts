export type APIError = {
  code: number;
  message: string;
  issues: string[];
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
};

export type PaginatedQuery = {
  query?: string;
  page: number;
  perPage: number;
};

export type PaginatedSearchCallback<T> = (
  query: PaginatedQuery,
) => Promise<APIResponse<PageData<T>>>;

export type PaginatableService<T> = {
  list: PaginatedSearchCallback<T>;
};

export type IconProps = {
  size?: number;
  width?: number;
  height?: number;
};
