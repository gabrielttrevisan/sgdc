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

export type IAuthContext = Readonly<{
  get user(): { id: string; name: string };
}>;

declare global {
  declare namespace Express {
    export interface Request {
      auth: IAuthContext;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string;
  }
}

type Resource =
  | "measuring_unit"
  | "allocation_type"
  | "beneficiary"
  | "family"
  | "city"
  | "donor"
  | "product"
  | "sala"
  | "volunteer"
  | (string & {});

type ResourceAction =
  | "list"
  | "view"
  | "create"
  | "delete"
  | "restore"
  | "pay"
  | "reset"
  | (string & {});
