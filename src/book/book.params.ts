
import { QueryParamsDto } from '../../helper/query-params.helper';
import { Op, Sequelize } from 'sequelize';

export class QueryParamsBook extends QueryParamsDto {
  mode: QueryMode;
  id: string;
  filter: string;
  page: number;
  size: number;
  sort: string;
  select: string;
  download: boolean;
}

export interface FilterGroup {
  id: string,
  judul: string;
  author: string;
  year: number;
  vol: string;
}

export const ToSeqWhere = (q: QueryParamsBook) => {
  let filterQuery = {};

  if (q['id']) {
    filterQuery['id'] = q['id'];
  }

  if (q['year']) {
    filterQuery['thn_rilis'] = q['year'];
  }

  if (q['onYear']) {
    const yearFilter = q['onYear'].split(',');
    if (yearFilter.length === 1) {
      filterQuery['thn_rilis'] = yearFilter[0];
    } else if (yearFilter.length === 2) {
      filterQuery['thn_rilis'] = {
        [Op.between]: [yearFilter[0], yearFilter[1]],
      };
    }
  }

  if (q['tittle']) {
    const authors = q['tittle'].split(',').map(a => a.trim());
    if (authors.length === 1) {
      filterQuery['judul'] = {
        [Op.like]: `%${authors[0]}%`
      };
    } else if (authors.length > 1) {
      filterQuery['judul'] = {
        [Op.or]: authors.map(a => ({
          [Op.like]: `%${a}%`,
        }))
      };
    }
  }

  //filter using sparator ,
  if (q['author']) {
    const authors = q['author'].split(',').map(a => a.trim());
    if (authors.length === 1) {
      filterQuery['pengarang'] = {
        [Op.like]: `%${authors[0]}%`
      };
    } else if (authors.length > 1) {
      filterQuery['pengarang'] = {
        [Op.or]: authors.map(a => ({
          [Op.like]: `%${a}%`,
        }))
      };
    }
  }



  //To Do Encyption filter
  // if (q.filter) {
  //   const filter: FilterGroup = JSON.parse(q.filter);
  //   Object.keys(filter).forEach((k) => {
  //     switch (k) {
  //       case 'id':
  //         filterQuery = {
  //           ...filterQuery,
  //           id: filter.id,
  //         };
  //         break;
  //       case 'judul':
  //         filterQuery = {
  //           ...filterQuery,
  //           judul: { [Op.like]: `%${filter.judul}%` },
  //         };
  //         break;
  //       case 'pengarang':
  //         filterQuery = {
  //           ...filterQuery,
  //           pengarang: filter.author,
  //         };
  //         break;
  //       case 'year':
  //         filterQuery = {
  //           ...filterQuery,
  //           thn_rilis: filter.year,
  //         };
  //         break;
  //       case 'volume':
  //         filterQuery = {
  //           ...filterQuery,
  //           volume: filter.vol,
  //         };
  //         break;
  //     }
  //   });
  // }

  return filterQuery;
};




export const ToSeqAttributes = (q: QueryParamsDto) => {
  if (q.select) {
    const f = atob(q.select);
    const selectObject = JSON.parse(f);
    if (f == '') return [];

    const attributes =
      selectObject &&
      Object.keys(selectObject).map((k) => {
        if (selectObject[k]) return k;
      });
    return attributes;
  }

  return undefined;
};


export type QueryMode = 'combobox' | 'table' | 'list';
