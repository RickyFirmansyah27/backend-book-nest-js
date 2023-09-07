export class QueryParamsDto {
    mode: QueryMode;
    filter: string;
    page: number;
    size: number;
    select: string;
    download: boolean;
  }
  
  export const ToSeqWhere = (q: QueryParamsDto) => {
    const f = atob(q.filter);
    if (f == '') return {};
    return JSON.parse(f);
  };
  
  export const ToSeqAttributes = (q: QueryParamsDto) => {
    if (q.select) {
      const f = atob(q.select);
      if (f == '') return [];
    }
  
    return [];
  };
  
  export type QueryMode = 'combobox' | 'table' | 'list';
  