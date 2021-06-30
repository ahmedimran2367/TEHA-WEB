export class Sort {
  by: string;
  direction: string;
}

export class SettingRequest {
  pageNo: number;
  pageSize: number;
  sort: Sort;
}
