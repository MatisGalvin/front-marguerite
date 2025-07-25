export interface Meta {
  pagination: Pagination;
}
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
export type Id = string | number;
export interface StrapiAttributes<T> {
  id: number;
  attributes: T & { [key: string]: any; data?: StrapiData<T> };
}

export type StrapiData<T> = StrapiAttributes<T>[] | StrapiAttributes<T>;

export interface StrapiResult<T> {
  data: StrapiData<T>;
}

export interface StrapiResultList<T> {
  data: StrapiAttributes<T>[];
}

export type StrapiSingleResult<T> = {
  data: {
    id: number;
    attributes: T;
  };
};

export type StrapiImage = {
  id: Id;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: {
      hash: string;
      ext: string;
      mime: string;
      width: number;
      height: number;
      size: number;
      path: string | null;
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export interface DeleteResponse {
  data: any;
  error: {
    status: number;
    name: string;
    message: string;
    details: any;
  };
}

export type StrapiError = {
  data: any;
  error: {
    status: number;
    name: string;
    message: string;
    details: any;
  };
};
