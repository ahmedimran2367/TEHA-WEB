export class Sort {
  by: string;
  direction: string;
}

export class LanguageRequest {
  category = 'all';
  freeSearch: string;
  pageNo: number;
  pageSize: number;
  sort: Sort;
}
